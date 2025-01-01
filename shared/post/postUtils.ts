import {
  PostCommentsDBType,
  PostLikesDBType,
  PostsDBType,
  PostTagsDBType,
} from "../dbType";
import {
  Post,
  PostComments,
  PostDetail,
  PostLikes,
  Posts,
  User,
} from "../types";

// 文章
export const transformPost = ({ posts }: { posts: PostsDBType }): Post => {
  const { id, user_id, content, visibility, created_at, updated_at } = posts;

  return {
    id,
    userId: user_id,
    content,
    visibility,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};

// 文章標籤
export const transformPostTags = ({
  postTags,
}: {
  postTags: PostTagsDBType[];
}) => {
  return (postTags || []).map((tag) => ({
    id: tag.id,
    postId: tag.post_id,
    tag: tag.tag,
  }));
};

// 文章留言
export const transformPostComments = ({
  postComments,
}: {
  postComments: PostCommentsDBType[];
}): PostComments[] => {
  return (postComments || []).map((comment) => ({
    id: comment.id,
    postId: comment.post_id,
    userId: comment.user_id,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
  }));
};

// 文章按讚數
export const transformPostLikes = ({
  postLikes,
}: {
  postLikes: PostLikesDBType[];
}): PostLikes[] => {
  return (postLikes || []).map((like) => ({
    id: like.id,
    postId: like.post_id,
    userId: like.user_id,
    createdAt: like.created_at,
  }));
};

// 文章詳細資訊
export const transformPostDetail = ({
  posts,
  user,
  tags,
  postLikes,
  postComments,
}: {
  posts: PostsDBType;
  user: User;
  tags: PostTagsDBType[];
  postLikes: PostLikesDBType[];
  postComments: PostCommentsDBType[];
}): PostDetail => {
  // 文章
  const transformedPost = transformPost({
    posts,
  });


  console.log('tags', tags)
  // 文章標籤
  const transformedTags = transformPostTags({
    postTags: tags,
  });

  console.log('transformedTags', transformedTags)

  //文章留言
  const transformedPostComments = transformPostComments({
    postComments,
  });

  //文章按讚
  const transformedPostLikes = transformPostLikes({
    postLikes,
  });

  return {
    user,
    tags: transformedTags,
    post: transformedPost,
    postComments: transformedPostComments,
    postLikes: transformedPostLikes,
  };
};
