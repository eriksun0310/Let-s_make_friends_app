import { useEffect } from "react";
import {
  addPost,
  deletePost,
  selectFriendList,
  selectUser,
  updatePost,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { supabase } from "../../util/supabaseClient";
import { PostsDBType } from "../../shared/dbType";
import { getPostDetail } from "../../util/handlePostEvent";

//監聽 文章變化
export const usePostListeners = () => {
  const dispatch = useAppDispatch();

  const personal = useAppSelector(selectUser);

  const friendList = useAppSelector(selectFriendList);

  // 共用的文章處理函式
  const handlePostChange = async ({
    event,
    post,
  }: {
    event: "INSERT" | "UPDATE";
    post: PostsDBType;
  }) => {
    // 判斷是否為自己的文章
    if (post.user_id === personal.userId) {
      console.log("自己的文章不處理");
      return;
    }

    const postDetail = await getPostDetail({
      currentUserId: personal.userId,
      post,
    });
    //根據
    if (post.visibility === "public") {
      if (event === "INSERT") {
        dispatch(addPost(postDetail));
      } else if (event === "UPDATE") {
        // console.log("postDetail 1111111", postDetail);
        dispatch(updatePost(postDetail));
      }
    } else if (post.visibility === "friends") {
      // 判斷是否為好友文章
      const hasFriendPost = friendList.some(
        (friend) => friend.userId === post.user_id
      );

      if (!hasFriendPost) {
        return; // 非好友文章不處理
      }

      if (event === "INSERT") {
        dispatch(addPost(postDetail));
      } else if (event === "UPDATE") {
        // console.log("postDetail 22222", postDetail);
        dispatch(updatePost(postDetail));
      }
    }
  };

  useEffect(() => {
    const subscribe = supabase
      .channel("public:posts")
      //監聽文章新增事件
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          const event = payload.eventType;
          const post = payload.new as PostsDBType;
          //監聽文章刪除事件
          if (event === "DELETE") {
            // 刪除 redux 文章
            dispatch(deletePost(post.id));
            //監聽文章(新增、更新事件)
          } else if (event === "INSERT" || event === "UPDATE") {
            await handlePostChange({
              event: event,
              post: post,
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, [friendList]);
};
