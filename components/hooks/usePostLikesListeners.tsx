import { useEffect, useMemo } from "react";
import {
  addPostInteraction,
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

  // 根據userId 獲取對應的用戶資料
  const getUserInfo = async (userId: string) => {
    // 自己按讚
    if (userId === personal.userId) {
      return { ...personal, userState: "personal" };
    }

    const friend = friendList.find((friend) => friend.userId === userId);
    // 好友按讚
    if (friend) {
      return { ...friend, userState: "friend" };
    }

    // 先回傳一個暫存的對象,避免UI 卡住
    dispatch(
      addPostLike({
        user: {
          userId,
          name: "載入中",
          avatar: "",
          userState: "visitor",
        },
        postId: "",
        createAt: "",
      })
    );

    // 訪客按讚
    // 獲取訪客的詳細資料
    const { data: visitor } = await getUserDetail({ userId });
    return {
      ...visitor,
      userState: "visitor",
    };
  };

  // 處理按讚的事件
  const handlePostLike = async ({
    newPostLike,
  }: {
    newPostLike: PostLikesDBType;
  }) => {
    const userInfo = await getUserInfo(newPostLike.user_id);
    dispatch(
      addPostLike({
        user: userInfo,
        postId: newPostLike.post_id,
        createAt: newPostLike.created_at,
      })
    );
    // 貼文後的互動通知
    dispatch(
      addPostInteraction({
        type: "like",
        user: userInfo,
        postId: newPostLike.post_id,
        createdAt: newPostLike.created_at,
      })
    );
  };

  useEffect(() => {
    if (!myPostIds?.length) return; // 沒有貼文就不用監聽

    const postChannel = supabase
      .channel("public:post_likes")
      // 監聽文章的按讚
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_likes",
          filter: `post_id=in.(${myPostIds.join(",")})`,
        },
        async (payload) => {
          const event = payload.eventType;
          // 用戶取消按讚
          if (event === "DELETE") {
            const deletedPostLike = payload.old as PostLikesDBType;
            const transformedPostLike = transformPostLike(deletedPostLike);
            dispatch(deletePostLike(transformedPostLike));
          } else {
            handlePostLike({
              newPostLike: payload.new as PostLikesDBType,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, [myPostIds]);
};
