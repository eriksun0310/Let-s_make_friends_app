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
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          //console.log('測試 11111')
          const newPost = payload.new as PostsDBType;

          await handlePostChange({
            event: "INSERT",
            post: newPost,
          });

          // 公開
          // if (newPost.visibility === "public") {
          //   const postDetail = await getPostDetail({
          //     post: newPost,
          //   });

          //   dispatch(addPost(postDetail));
          //   // 好友
          // } else if (newPost.visibility === "friends") {
          //   // 判斷發文者是否為好友
          //   const hasFriendPost = friendList.some(
          //     (friend) => friend.userId === newPost.user_id
          //   );

          //   // 不是好友發的文
          //   if (!hasFriendPost) {
          //     return;
          //   }

          //   const postDetail = await getPostDetail({
          //     post: newPost,
          //   });

          //   dispatch(addPost(postDetail));
          // }
        }
      )

      //監聽文章更新事件
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          //console.log('測試 22222')
          console.log("payload", payload);
          const updatedPost = payload.new as PostsDBType;
          await handlePostChange({
            event: "UPDATE",
            post: updatedPost,
          });
        }
      )
      //監聽文章刪除事件
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          const deletedPost = payload.old as PostsDBType;
          // 刪除 redux 文章
          dispatch(deletePost(deletedPost.id));
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, [friendList]);
};
