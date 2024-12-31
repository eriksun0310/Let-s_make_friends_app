import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { PostTags, Post, PostComments, PostLikes } from "../shared/types";

interface InitialStateProps {
  tags: PostTags[];
  posts: Post[];
  postComments: PostComments[];
  postLikes: PostLikes[];
}

const initialState: InitialStateProps = {
  tags: [],
  posts: [],
  postComments: [],
  postLikes: [],
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
      state.posts.push(action.payload);
    },

    updatePost(state, action) {},
    deletePost(state, action) {},

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
