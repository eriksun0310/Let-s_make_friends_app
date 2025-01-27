import { useEffect } from "react";
import {
  addPostLike,
  deletePostLike,
  selectFriendList,
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
          ...personal,
          postId: newPostLike.post_id,
          userState: "personal",
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
          ...findFriend,
          postId: newPostLike.post_id,
          userState: "friend",
        })
      );

      // 訪客按讚
    } else {
      const { data: findVisitor } = await getUserDetail({
        userId: newPostLike.user_id,
      });
      dispatch(
        addPostLike({
          ...findVisitor,
          postId: newPostLike.post_id,
          userState: "visitor",
        })
      );
    }
  };

  useEffect(() => {
    const subscribe = supabase
      .channel("public:post_likes")
      // 監聽文章的按讚
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "post_likes",
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
        },
        (payload) => {
          const deletedPostLike = payload.old as PostLikesDBType;
          // 判斷是否為自己取消按讚
          if (deletedPostLike.user_id === personal.userId) {
            console.log("自己取消按讚不處理");
            return;
          }
          const transformedPostLike = transformPostLike(deletedPostLike);
          dispatch(deletePostLike(transformedPostLike));
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, []);
};
