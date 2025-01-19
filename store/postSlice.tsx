import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { PostTags, PostComments, PostLikes, PostDetail } from "../shared/types";

interface InitialStateProps {
  tags: PostTags[];
  posts: PostDetail[];
  postComments: PostComments[]; // 這個應該是用不到
  postLikes: PostLikes[]; // 這個應該是用不到
  postMap: Record<string, PostDetail>; // 用於儲存文章id和對應的文章
  likeDrawer: boolean;
}

const initialState: InitialStateProps = {
  tags: [],
  posts: [],
  postComments: [],
  postLikes: [],
  postMap: {},
  likeDrawer: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setTags(state, action) {
      state.tags = action.payload;
    },

    addTag(state, action) {
      state.tags = [...state.tags, action.payload];
    },

    setPosts(state, action) {
      state.posts = action.payload;
    },

    addPost(state, action) {
      const postId = action.payload.post.id;

      //  檢查是否有重複的貼文(for 文章監聽器用的)
      if (state.postMap[postId]) {
        console.log("已有貼文");
        return;
      }

      state.postMap[postId] = action.payload;

      state.posts = [...state.posts, action.payload];
      // 排序 貼文
      state.posts.sort(
        (a, b) =>
          new Date(b.post.createdAt).getTime() -
          new Date(a.post.createdAt).getTime()
      );
    },

    // 目前還沒用到 重製文章
    // resetPosts(state) {
    //   state.posts = [];
    //   state.postMap = {};
    // },

    updatePost(state, action) {
      const updatedPost = action.payload;

      const index = state.posts.findIndex(
        (post) => post.post.id === updatedPost.post.id
      );

      if (index === -1) {
        console.log("文章不存在");
        return;
      }

      // 更新文章
      state.posts[index] = updatedPost;
    },
    deletePost(state, action) {
      const postId = action.payload;

      // 找到刪除文章的索引
      const index = state.posts.findIndex((post) => post.post.id === postId);

      // 如果文章存在的話, 就刪除
      if (index !== -1) {
        state.posts.splice(index, 1);
      }
    },

    setPostComments(state, action) {
      state.postComments = action.payload;
    },

    addPostComment(state, action) {
      state.postComments = [...state.postComments, action.payload];
    },

    updatePostComment(state, action) {},
    deletePostComment(state, action) {},

    addPostLike(state, action) {
      const postLike = action.payload as PostLikes;

      // 找到對應的post
      const index = state.posts.findIndex(
        (post) => post.post.id === postLike.postId
      );

      // 找到對應的post
      if (index !== -1) {
        //找到對應的 postLikes
        const existingPostLikes = state.posts[index].postLikes;

        // 檢查是否已經存在該按讚
        const likeExists = existingPostLikes.some(
          (like) => like.userId === postLike.userId
        );

        // 如果不存在
        if (!likeExists) {
          //創建一個新的posts 陣列並更新目標的post的postLikes
          state.posts[index] = {
            ...state.posts[index],
            postLikes: [...existingPostLikes, postLike],
          };
        }
      }
    },

    // deletePostLike(state, action) {
    //   const postLike = action.payload as PostLikes;

    //   // 找到對應的post
    //   const index = state.posts.findIndex(
    //     (post) => post.post.id === postLike.postId
    //   );

    //   if (index !== -1) {
    //     const existingPostLikes = state.posts[index].postLikes;

    //     const likeExists = existingPostLikes.some(
    //       (like) => like.userId === postLike.userId
    //     );

    //     if (likeExists) {
    //       state.posts[index] = {
    //         ...state.posts[index],
    //         postLikes: existingPostLikes.filter(
    //           (like) => like.userId !== postLike.userId
    //         ),
    //       };
    //     }
    //   }
    // },
    deletePostLike(state, action) {
      const postLike = action.payload as PostLikes;

      // 找到對應的post
      const index = state.posts.findIndex(
        (post) => post.post.id === postLike.postId
      );

      // 有找到對應的 post
      if (index !== -1) {
        const existingPostLikes = state.posts[index].postLikes;

        // 將 postLikes 轉為Map 進行查找
        const likesMap = new Map(
          existingPostLikes.map((like) => [like.userId, like])
        );

        // 如果存在該 like , 就刪除
        if (likesMap.has(postLike.userId)) {
          likesMap.delete(postLike.userId);

          // 重新構件 postLikes 陣列
          state.posts[index] = {
            ...state.posts[index],
            postLikes: Array.from(likesMap.values()), // 將 Map 轉為陣列
          };
        }

        // const likeExists = existingPostLikes.some(
        //   (like) => like.userId === postLike.userId
        // );

        // if (likeExists) {
        //   state.posts[index] = {
        //     ...state.posts[index],
        //     postLikes: existingPostLikes.filter(
        //       (like) => like.userId !== postLike.userId
        //     ),
        //   };
        // }
      }
    },
    setLikeDrawer(state, action) {
      state.likeDrawer = action.payload;
    },
  },
});

export const {
  setTags,
  addTag,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setPostComments,
  addPostComment,
  updatePostComment,
  deletePostComment,
  addPostLike,
  deletePostLike,
  setLikeDrawer,
} = postSlice.actions;

export const selectTags = (state: RootState) => state.post.tags;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectPostComments = (state: RootState) => state.post.postComments;
export const selectPostLikes = (state: RootState) => state.post.postLikes;
export const selectLikeDrawer = (state: RootState) => state.post.likeDrawer;

export default postSlice.reducer;
