import { useEffect } from "react";
import {
  addPostLike,
  deletePostLike,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { supabase } from "../../util/supabaseClient";
import { PostLikesDBType } from "../../shared/dbType";
import { transformPostLike } from "../../shared/post/postUtils";

// 監聽文章的按讚數
export const usePostLikesListeners = () => {
  const dispatch = useAppDispatch();

  const personal = useAppSelector(selectUser);

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
        (payload) => {
          const newPostLike = payload.new as PostLikesDBType;
          // 判斷是否為自己點讚
          // if (newPostLike.user_id === personal.userId) {
          //   console.log("自己點讚不處理");
          //   return;
          // }

          console.log("newPostLike 監聽器", newPostLike);
          const transformedPostLike = transformPostLike(newPostLike);

          console.log("transformedPostLike 監聽器", transformedPostLike);
          dispatch(addPostLike(transformedPostLike));
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
          const newPostLike = payload.new as PostLikesDBType;
          // 判斷是否為自己點讚
          // if (newPostLike.user_id === personal.userId) {
          //   console.log("自己點讚不處理");
          //   return;
          // }

          console.log("newPostLike 監聽器 2222", newPostLike);
          const transformedPostLike = transformPostLike(newPostLike);

          console.log("transformedPostLike 監聽器 2222", transformedPostLike);
          dispatch(addPostLike(transformedPostLike));
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
