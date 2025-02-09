import { useEffect, useMemo } from "react";
import {
  addPostLike,
  deletePostLike,
  selectFriendList,
  selectPosts,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { supabase } from "../../util/supabaseClient";
import { PostLikesDBType } from "../../shared/dbType";
import { transformPostLike } from "../../shared/post/postUtils";
import { getUserDetail } from "../../util/handleUserEvent";

// 監聽文章的按讚數
export const usePostLikesListeners = () => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const postData = useAppSelector(selectPosts);

  // 取得自己發的貼文的id
  const myPostIds = useMemo(
    () =>
      postData
        ?.filter((post) => post.post.userId === personal.userId)
        ?.map((post) => post.post.id),
    [postData, personal.userId]
  );

  console.log("myPostIds", personal.userId, myPostIds);

  const friendList = useAppSelector(selectFriendList);

  // 處理按讚的事件
  const handlePostLike = async ({
    newPostLike,
  }: {
    newPostLike: PostLikesDBType;
  }) => {
    // 自己點讚
    if (newPostLike.user_id === personal.userId) {
      dispatch(
        addPostLike({
          user: {
            ...personal,
            userState: "personal",
          },
          postId: newPostLike.post_id,
          createAt: newPostLike.created_at,
        })
      );
      return;
    }

    const hasFriendPostLike = friendList.some(
      (friend) => friend.userId === newPostLike.user_id
    );

    // 好友按讚
    if (hasFriendPostLike) {
      const findFriend = friendList.find(
        (friend) => friend.userId === newPostLike.user_id
      );
      // TODO: 用userId 來取得用戶資料

      dispatch(
        addPostLike({
          user: {
            ...findFriend,
            userState: "friend",
          },
          postId: newPostLike.post_id,
          createAt: newPostLike.created_at,
        })
      );

      // 訪客按讚
    } else {
      const { data: findVisitor } = await getUserDetail({
        userId: newPostLike.user_id,
      });
      dispatch(
        addPostLike({
          user: {
            ...findVisitor,
            userState: "visitor",
          },
          postId: newPostLike.post_id,
          createAt: newPostLike.created_at,
        })
      );
    }
  };

  useEffect(() => {
    const postChannel = supabase
      .channel("public:post_likes")
      // 監聽文章的按讚
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "post_likes",
          filter: `post_id=in.(${myPostIds.join(",")})`,
        },
        async (payload) => {
          handlePostLike({
            newPostLike: payload.new as PostLikesDBType,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "post_likes",
          filter: `post_id=in.(${myPostIds.join(",")})`,
        },
        (payload) => {
          handlePostLike({
            newPostLike: payload.new as PostLikesDBType,
          });
        }
      )

      // 監聽文章的取消按讚
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "post_likes",
          filter: `post_id=in.(${myPostIds.join(",")})`,
        },
        (payload) => {
          const deletedPostLike = payload.old as PostLikesDBType;
          const transformedPostLike = transformPostLike(deletedPostLike);
          dispatch(deletePostLike(transformedPostLike));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, [myPostIds]);
};
