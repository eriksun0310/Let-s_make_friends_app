/*
處理 發文的 db 操作
post_tags: 文章標籤
posts: 文章
post_comments: 文章留言
post_likes: 文章按讚
*/

import { PostTagsDBType } from "../shared/dbType";
import { transformPost } from "../shared/post/postUtils";
import { NewPost, PostCombine, PostDetail, Result } from "../shared/types";
import { getFriendDetail, getFriendList } from "./handleFriendsEvent";
import { supabase } from "./supabaseClient";

// 取得 所有的tag
export const getPostTags = async (): Promise<PostTagsDBType[]> => {
  const { data, error } = await supabase.from("post_tags").select("*");

  if (error) {
    console.error("Error fetching post tags:", error);
    return [];
  }
  return data;
};

// 新增 tag
export const addPostTag = async ({
  tags,
  postId,
}: {
  tags: string[];
  postId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  resultTags?: string[];
}> => {
  const tagsData = tags.map((tag) => ({
    tag,
    post_id: postId,
  }));

  //   批量插入
  const { data, error } = await supabase
    .from("post_tags")
    .insert(tagsData)
    .select("tag");
  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    };
  }

  return {
    success: true,
    resultTags: data.map((item) => item.tag), // 確保只回傳 tag 值
  };
};

// 取得所有文章(好友 + 自己+ 非好友但設為公開)的文章

// TODO:　return 回來的資料應該是要包含 發文者的資訊、標籤、留言數、按讚數

export const getAllPosts = async ({
  userId,
}: {
  userId: string;
}): Promise<PostCombine[]> => {
  // 取得好友資訊
  const friendList = await getFriendList(userId);

  // 提取好友 ID
  const friendIds = friendList.map((friend) => friend.userId);

  // 查詢所有文章
  const { data: postsData, error: postsError } = await supabase
  .from("posts");
};

// 文章的詳細資訊
/*
 TODO:

 return 回來的資料應該是要包含
1. 發文者資料: users
2. 留言者資料: users
3. 按讚者資料: post_likes + users 
4. 發文內容: posts
5. 留言內容: post_comments
6. 是否有tag: post_tags
*/

export const getPostDetail = async (postId: string): Promise<PostDetail> => {};

// 取得使用者的文章(for :個人資訊、好友資訊用的)
// TODO: 到時候可能要識別出是好友還是訪客，好友可以看到所有文章，訪客只能看到公開的文章
export const getUserPosts = async (
  userId: string
): Promise<PostCombine[]> => {};

// 新增文章
export const addPost = async ({
  newPost,
}: {
  newPost: NewPost;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  resultPost?: PostCombine;
}> => {
  try {
    // 新增文章並取得插入的文章 ID
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: newPost.userId,
        content: newPost.content,
        visibility: newPost.visibility,
        created_at: new Date().toISOString(),
      })
      .select("*") //只回傳新文章的id
      .single(); // 確保只返回單條文章

    if (postError) {
      console.log("新增文章 失敗", postError);
      return {
        success: false,
        errorMessage: postError.message,
      };
    }

    const postId = postData?.id; // 取得新增文章的 id
    // 新增標籤
    const tagsResult = await addPostTag({
      tags: newPost.tags,
      postId: postId,
    });

    if (!tagsResult.success) {
      return {
        success: false,
        errorMessage: tagsResult.errorMessage,
      };
    }

    // 轉換文章的資料格式
    const transformedPost = transformPost({
      posts: postData,
    });

    // 發文者的基本資訊
    const user = await getFriendDetail(postData.user_id);

    return {
      success: true,
      resultPost: {
        post: transformedPost,
        user: user,
        tags: tagsResult.resultTags || [], // 如果標籤新增失敗，返回空陣列
        postLikes: [], // 新文章沒有按讚
        postComments: [], // 新文章沒有留言
      },
    };
  } catch (error) {
    console.error("Error adding post:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};
