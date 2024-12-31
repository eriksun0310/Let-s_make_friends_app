import { PostsDBType } from "../dbType";
import { Posts } from "../types";

export const transformPost = ({ posts }: { posts: PostsDBType }): Posts => {
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
