import { useEffect } from "react";
import {
  addPost,
  selectFriendList,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { supabase } from "../../util/supabaseClient";
import { PostsDBType } from "../../shared/dbType";
import { getPostDetail } from "../../util/handlePostEvent";

//監聽 文章變化
export const usePostListeners = () => {
  const dispatch = useAppDispatch();

  const friendList = useAppSelector(selectFriendList);

  useEffect(() => {
    const subscribe = supabase.channel("public:posts").on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "posts",
      },
      async (payload) => {
        const newPost = payload.new as PostsDBType;

        // 公開
        if (newPost.visibility === "public") {
          const postDetail = await getPostDetail({
            post: newPost,
          });
          console.log("postDetail public", postDetail);

          dispatch(addPost(postDetail));
          // 好友
        } else if (newPost.visibility === "friends") {
          // 判斷發文者是否為好友
          const hasFriendPost = friendList.some(
            (friend) => friend.userId === newPost.user_id
          );

          // 不是好友發的文
          if (!hasFriendPost) {
            return;
          }

          const postDetail = await getPostDetail({
            post: newPost,
          });

          dispatch(addPost(postDetail));
        }
      }
    );

    return () => {
      subscribe.unsubscribe();
    };
  }, [dispatch, friendList]);
};
