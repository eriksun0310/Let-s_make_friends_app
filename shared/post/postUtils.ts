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
  PostTags,
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
}): PostTags[] => {
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

export const transformPostLike = (postLikes: PostLikesDBType): PostLikes => ({
  postId: postLikes.post_id,
  userId: postLikes.user_id,
  createdAt: postLikes.created_at,
});

// 文章按讚數
export const transformPostLikes = (
  postLikes: PostLikesDBType[]
): PostLikes[] => {
  return (postLikes || []).map(transformPostLike);
};

// 文章詳細資訊

// 目前用不到
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

  // 文章標籤
  const transformedTags = transformPostTags({
    postTags: tags,
  })?.map((tag) => tag.tag);


  //文章留言
  const transformedPostComments = transformPostComments({
    postComments,
  });

  //文章按讚
  const transformedPostLikes = transformPostLikes(postLikes);

  return {
    user,
    tags: transformedTags,
    post: transformedPost,
    postComments: transformedPostComments,
    postLikes: transformedPostLikes,
  };
};
