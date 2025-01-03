import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  PostTags,
  Post,
  PostComments,
  PostLikes,
  PostDetail,
} from "../shared/types";

interface InitialStateProps {
  tags: PostTags[];
  posts: PostDetail[];
  postComments: PostComments[];
  postLikes: PostLikes[];
  postMap: Record<string, PostDetail>; // 用於儲存文章id和對應的文章
}

const initialState: InitialStateProps = {
  tags: [],
  posts: [],
  postComments: [],
  postLikes: [],
  postMap: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setTags(state, action) {
      state.tags = action.payload;
    },

    addTag(state, action) {
      state.tags.push(action.payload);
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

      state.posts.push(action.payload);
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
      state.postComments.push(action.payload);
    },

    updatePostComment(state, action) {},
    deletePostComment(state, action) {},

    setPostLikes(state, action) {
      state.postLikes = action.payload;
    },

    updatePostLikes(state, action) {},
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
  setPostLikes,
  updatePostLikes,
} = postSlice.actions;

export const selectTags = (state: RootState) => state.post.tags;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectPostComments = (state: RootState) => state.post.postComments;
export const selectPostLikes = (state: RootState) => state.post.postLikes;

export default postSlice.reducer;
