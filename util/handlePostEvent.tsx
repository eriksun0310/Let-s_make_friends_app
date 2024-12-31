/*
處理 發文的 db 操作
post_tags: 文章標籤
posts: 文章
post_comments: 文章留言
post_likes: 文章按讚
*/

import { PostTagsDBType } from "../shared/dbType";
import { transformPost, transformPostDetail } from "../shared/post/postUtils";
import { NewPost, PostDetail, Result, User } from "../shared/types";
import {
  getFriendDetail,
  getFriendDetails,
  getFriendList,
} from "./handleFriendsEvent";
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
  try {
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
  } catch (error) {
    console.log("新增標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// 取得所有文章(好友 + 自己+ 非好友但設為公開)的文章

// TODO:　return 回來的資料應該是要包含 發文者的資訊、標籤、留言數、按讚數

export const getAllPosts = async ({
  userId,
}: {
  userId: string;
}): Promise<PostDetail[]> => {
  // 取得好友資訊
  const friendList = await getFriendList(userId);

  // 提取好友 ID
  const friendIds = friendList.map((friend) => friend.userId);

  // 查詢所有文章
  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .or(
      `user_id.eq.${userId},user_id.in.(${friendIds.join(
        ","
      )}),visibility.eq.public`
    )
    .order("created_at", { ascending: false }); // 按創建時間排序;

  if (postsError) {
    console.log("查詢所有文章 錯誤", postsError);
    return [];
  }

  // 提取文章id
  const postIds = postsData.map((post) => post.id);

  // 提取發文者id
  const userIds = postsData.map((post) => post.user_id);

  // 批量查詢發文者資訊
  const users = await getFriendDetails(userIds);

  // 查詢文章標籤
  const { data: tagsData, error: tagsError } = await supabase
    .from("post_tags")
    .select("*")
    .in("post_id", postIds); // 篩選相關文章的標籤

  if (tagsError) {
    console.log("查詢文章標籤 錯誤", tagsError);
    return [];
  }

  // 查詢文章按讚
  const { data: likesData, error: likesError } = await supabase
    .from("post_likes")
    .select("*")
    .in("post_id", postIds); // 篩選相關文章的按讚數

  if (likesError) {
    console.log("查詢文章按讚 錯誤", likesError);
    return [];
  }

  // 查詢文章留言
  const { data: commentsData, error: commentsError } = await supabase
    .from("post_comments")
    .select("*")
    .in("post_id", postIds); // 篩選相關文章的留言

  if (commentsError) {
    console.log("查詢文章留言 錯誤", commentsError);
    return [];
  }

  const postDetails = postsData.map((post) => {
    // 找到對應的發文者資訊
    const user = users.find((user) => user.userId === post.user_id);

    // 過濾對應的標籤、按讚數和留言
    const tags = tagsData.filter((tag) => tag.post_id === post.id);
    const likes = likesData.filter((like) => like.post_id === post.id);
    const comments = commentsData.filter(
      (comment) => comment.post_id === post.id
    );

    // 轉換文章詳情
    const transformedPostDetail = transformPostDetail({
      posts: post,
      user: user || ({} as User),
      tags,
      postLikes: likes,
      postComments: comments,
    });

    return transformedPostDetail;
  });

  return postDetails;
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
export const getUserPosts = async (userId: string): Promise<PostDetail[]> => {};

// 新增文章
export const addPostDB = async ({
  newPost,
}: {
  newPost: NewPost;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  resultPost?: PostDetail;
}> => {
  try {
    // 新增文章並取得插入的文章 ID
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: newPost.userId,
        content: newPost.content,
        visibility: newPost.visibility,
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
      console.log("新增標籤 失敗", tagsResult.errorMessage);
      return {
        success: false,
        errorMessage: tagsResult.errorMessage,
      };
    }
    // 發文者的基本資訊
    const user = await getFriendDetail(postData.user_id);

    // 轉換文章的資料格式
    const transformedPost = transformPost({
      posts: postData,
    });

    return {
      success: true,
      resultPost: {
        post: transformedPost,
        user: user || ({} as User),
        tags: tagsResult.resultTags || [], // 如果標籤新增失敗，返回空陣列
        postLikes: [], // 新文章沒有按讚
        postComments: [], // 新文章沒有留言
      },
    };
  } catch (error) {
    console.log("Error adding post:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};
