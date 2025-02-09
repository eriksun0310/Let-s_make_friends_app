import { PostsDBType, TagsDBType } from "../shared/dbType";
import {
  transformPost,
  transformPostComments,
  transformPostLikes,
} from "../shared/post/postUtils";
import {
  AddANDUpdatePost,
  NewPost,
  PostComments,
  PostDetail,
  PostLikes,
  PostLikeUser,
  PostTags,
  Result,
  UpdatedPost,
  User,
  UserSettings,
  UserState,
} from "../shared/types";
import { getFriendList } from "./handleFriendsEvent";
import {
  getAllUsersSettings,
  getUserDetail,
  getUsersDetail,
  getUserSettings,
} from "./handleUserEvent";
import { supabase } from "./supabaseClient";

type GetTagsReturn = Result & {
  data: string[];
};
// ☑️ 取得 所有可用的tag(for: 新增文章用的)
export const getTags = async (): Promise<GetTagsReturn> => {
  try {
    const { data: tagsData, error } = await supabase
      .from("tags")
      .select("name");

    if (error) {
      console.log("所有可用的tag 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: tagsData.map((tag) => tag.name) || [],
    };
  } catch (error) {
    console.log("所有可用的tag 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

//☑️ 新增 文章標籤
export const addPostTag = async ({
  tagIds,
  postId,
}: {
  tagIds: string[];
  postId: string;
}): Promise<Result> => {
  try {
    const tagsData = tagIds.map((tagId) => ({
      tag_id: tagId,
      post_id: postId,
    }));

    //   批量插入
    const { error } = await supabase
      .from("post_tags")
      .upsert(tagsData, { onConflict: "tag_id, post_id" });

    if (error) {
      console.log("新增文章標籤失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("新增文章標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

type AddTagsReturn = Result & {
  data: TagsDBType[];
};

// ☑️ 新增所有可用標籤
export const addTags = async ({
  tags,
  postId,
}: {
  tags: string[];
  postId: string;
}): Promise<AddTagsReturn> => {
  try {
    // 使用 upsert 一次性處理標籤新增或返回已存在的標籤
    const { data: allTags, error: tagsError } = await supabase
      .from("tags")
      .upsert(
        tags.map((name) => ({ name })),
        { onConflict: "name" }
      )
      .select("*");

    if (tagsError) {
      console.log("更新 所有可用標籤失敗", tagsError);
      return {
        success: false,
        errorMessage: tagsError.message,
        data: [],
      };
    }

    // 提取所有標籤的 ID
    const tagIds = allTags.map((tag) => tag.id);

    // 新增文章標籤
    const { success, errorMessage } = await addPostTag({
      tagIds,
      postId,
    });

    if (!success) {
      console.log("新增文章標籤失敗", errorMessage);
      return {
        success: false,
        errorMessage,
        data: [],
      };
    }

    return {
      success: true,
      data: allTags,
    };
  } catch (error) {
    console.log("新增所有可用標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

type GetPostTagsReturn = Result & {
  data: PostTags[];
};

//☑️ 取得文章內的tag
export const getPostTags = async ({
  postIds,
}: {
  postIds: string[];
}): Promise<GetPostTagsReturn> => {
  try {
    const { data: postTags, error } = await supabase
      .from("post_tags")
      .select("post_id , tag_id")
      .in("post_id", postIds);

    if (error) {
      console.log("取得文章標籤失敗", error);
      return {
        success: false,
        errorMessage: (error as Error).message,
        data: [],
      };
    }

    const tagIds = postTags?.map((postTag) => postTag.tag_id);

    const { data: tagsData, error: tagsError } = await supabase
      .from("tags")
      .select("id, name")
      .in("id", tagIds);

    if (tagsError) {
      console.log("取得文章標籤失敗", tagsError);
      return {
        success: false,
        errorMessage: (tagsError as Error).message,
        data: [],
      };
    }

    const transformedPostTags = postTags?.map((postTag) => {
      const tag = tagsData?.find((tag) => tag.id === postTag.tag_id);
      return {
        id: postTag.tag_id,
        postId: postTag.post_id,
        tag: tag?.name || "",
      };
    });

    return {
      success: true,
      data: transformedPostTags,
    };
  } catch (error) {
    console.log("取得文章標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

// TODO:　return 回來的資料應該是要包含 發文者的資訊、標籤、留言數、按讚數
/*
⛔ 未測試
將好友移除後 朋友的貼文不會顯示


✅ 已測試
公開的貼文: 不管是好友還是非好友都會顯示
朋友的貼文: 只有朋友可以看到
*/

type GetAllPostsReturn = Result & {
  data: PostDetail[];
};

// 取得所有文章(好友 + 自己+ 非好友但設為公開)的文章
export const getAllPosts = async ({
  userId,
}: {
  userId: string;
}): Promise<GetAllPostsReturn> => {
  try {
    // 取得好友資訊
    const { data: friendList } = await getFriendList({
      currentUserId: userId,
    });

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
      console.log("查詢所有文章 失敗", postsError);
      return {
        success: false,
        errorMessage: (postsError as Error).message,
        data: [],
      };
    }

    // 提取文章id
    const postIds = postsData.map((post) => post.id);
    // 提取發文者id
    const userIds = postsData.map((post) => post.user_id);

    // 批量查詢發文者資訊
    const { data: users } = await getUsersDetail({
      userIds,
    });

    // 取得文章標籤
    const { data: postTags } = await getPostTags({ postIds });

    // 查詢文章按讚的用戶資料
    const { data: postLikesWithUsers } = await getPostLikesWithUsers({
      currentUserId: userId,
      postIds: postIds,
    });

    // 查詢文章留言
    const { data: commentsData } = await getPostCommentsByPostId({ postIds });

    // 轉換文章格式
    const postDetails = postsData.map((post) => {
      // 找到對應的發文者資訊
      const user = users.find((user) => user.userId === post.user_id);

      // 過濾對應的標籤、按讚數和留言
      const tags = postTags.filter((tag) => tag.postId === post.id);
      const postLikes = postLikesWithUsers?.filter(
        (like) => like.postId === post.id
      ) as PostLikeUser[];

      const comments = commentsData.filter(
        (comment) => comment.postId === post.id
      );

      const transformedPost = transformPost({
        posts: post,
      });

      // 轉換文章詳情
      const transformedPostDetail: PostDetail = {
        post: transformedPost,
        user: user || ({} as User),
        tags: tags?.map((tag) => tag.tag) || [],
        postLikes: postLikes,
        postComments: comments,
      };

      return transformedPostDetail;
    });

    return {
      success: true,
      data: postDetails,
    };
  } catch (error) {
    console.log("取得所有文章失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

/*
 TODO: 到時候要刪
 return 回來的資料應該是要包含
1. 發文者資料: users
2. 留言者資料: users
3. 按讚者資料: post_likes + users 
4. 發文內容: posts
5. 留言內容: post_comments
6. 是否有tag: post_tags
*/

type GetPostDetailReturn = Result & {
  data: PostDetail | null;
};

//☑️ 取得文章的詳細資訊
export const getPostDetail = async ({
  currentUserId,
  post,
}: {
  currentUserId: string;
  post: PostsDBType;
}): Promise<GetPostDetailReturn> => {
  try {
    // 轉換文章的資料格式
    const transformedPost = transformPost({
      posts: post,
    });

    // 取得發文者資訊
    const { data: user } = await getUserDetail({ userId: post.user_id });

    // 取得文章標籤
    const { data: postTags } = await getPostTags({ postIds: [post.id] });

    // 過濾對應文章的標籤
    const findPostTagsData = postTags.filter((tag) => tag.postId === post.id);

    // 查詢文章按讚
    const { data: postLikesWithUsers } = await getPostLikesWithUsers({
      currentUserId,
      postIds: [post.id],
    });

    // TODO: 需要確認是否正確
    console.log("postLikesWithUsers 111111", postLikesWithUsers);
    // 過濾對應文章的按讚
    // const findPostLikesData = postLikesWithUsers?.filter(
    //   (like) => like.postId === post.id
    // ) as PostLikeUser[];

    // 查詢文章留言
    const { data: commentsData } = await getPostCommentsByPostId({
      postIds: [post.id],
    });

    const returnData = {
      user: user,
      post: transformedPost,
      tags: findPostTagsData.map((tag) => tag.tag),
      postLikes: postLikesWithUsers,
      postComments: commentsData,
    };

    return {
      success: true,
      data: returnData,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

type AddPostDBReturn = Result & {
  data: AddANDUpdatePost | null;
};

//☑️ 新增文章
export const addPostDB = async ({
  newPost,
}: {
  newPost: NewPost;
}): Promise<AddPostDBReturn> => {
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
        data: null,
      };
    }

    // 新增標籤
    const { data: tags } = await addTags({
      tags: newPost.tags,
      postId: postData?.id,
    });

    // 轉換文章的資料格式
    const transformedPost = transformPost({
      posts: postData,
    });

    const returnData = {
      post: transformedPost,
      tags: tags?.map((tag) => tag.name) || [], // 如果標籤新增失敗，返回空陣列
      postLikes: [], // 新文章沒有按讚
      postComments: [], // 新文章沒有留言
    };

    return {
      success: true,
      data: returnData,
    };
  } catch (error) {
    console.log("Error adding post:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

type UpdatePostDBReturn = Result & {
  data: AddANDUpdatePost | null;
};

//  ✅更新文章
export const updatePostDB = async ({
  updatedPost,
}: {
  updatedPost: UpdatedPost;
}): Promise<UpdatePostDBReturn> => {
  try {
    // 更新文章
    const { data: updatedPostsData, error } = await supabase
      .from("posts")
      .update({
        content: updatedPost.content,
        visibility: updatedPost.visibility,
      })
      .eq("id", updatedPost.postId)
      .select("*")
      .single();

    if (error) {
      console.log("更新文章 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: null,
      };
    }

    //獲取舊的 post_tags
    const { data: oldPostTags, error: oldTagsError } = await supabase
      .from("post_tags")
      .select("tag_id")
      .eq("post_id", updatedPost.postId);

    if (oldTagsError) {
      console.log("取得舊的 post_tags 失敗", oldTagsError.message);
      return {
        success: false,
        errorMessage: oldTagsError.message,
        data: null,
      };
    }

    const oldTagIds = oldPostTags?.map((tag) => tag.tag_id);

    //更新標籤
    const { data: tags } = await addTags({
      tags: updatedPost.tags,
      postId: updatedPost.postId,
    });

    const newTagIds = tags?.map((tag) => tag.id);

    // 比較新舊標籤
    const tagsToRemove = oldTagIds?.filter((id) => !newTagIds?.includes(id));
    const tagsToAdd = newTagIds?.filter((id) => !oldTagIds?.includes(id));

    // 刪除不需要的標籤
    if (tagsToRemove.length > 0) {
      const { error: deletePostTagsError } = await supabase
        .from("post_tags")
        .delete()
        .in("tag_id", tagsToRemove)
        .eq("post_id", updatedPost.postId);

      if (deletePostTagsError) {
        console.log("刪除文章標籤失敗", deletePostTagsError.message);
        return {
          success: false,
          errorMessage: deletePostTagsError.message,
          data: null,
        };
      }
    }

    // 新增需要的標籤
    if (tagsToAdd.length > 0) {
      await addPostTag({ tagIds: tagsToAdd, postId: updatedPost.postId });
    }

    // 轉換文章的資料格式
    const transformedPost = transformPost({
      posts: updatedPostsData,
    });

    const returnData = {
      post: transformedPost,
      tags: tags?.map((tag) => tag.name) || [], // 如果標籤新增失敗，返回空陣列
      postLikes: [], //TODO: 到時候再改
      postComments: [], //TODO: 到時候再改
    };

    return {
      success: true,
      data: returnData,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

//☑️ 刪除文章
export const deletePostDB = async ({
  postId,
}: {
  postId: string;
}): Promise<Result> => {
  try {
    // 刪除文章
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("刪除文章失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

/*
⛔取得所有文章的按讚
等實際按讚 看看能不能取得正確的按讚數
yu:這好像用不到
*/
//🈲
export const getPostLikesByPostId = async ({
  postIds,
}: {
  postIds: string[];
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: PostLikes[];
}> => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .in("post_id", postIds); // 篩選相關文章的按讚數

    if (error) {
      console.log("取得文章按讚失敗", error);
      return {
        success: false,
        errorMessage: (error as Error).message,
        data: [],
      };
    }
    const transformedPostLikes = transformPostLikes(data);

    return {
      success: true,
      data: transformedPostLikes,
    };
  } catch (error) {
    console.log("取得文章按讚失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

/*
⛔取得所有文章的留言
等實際按讚 看看能不能取得正確的留言
yu:之後要改成 取每個留言順便帶user資料
*/

type GetPostCommentsByPostIdReturn = Result & {
  data: PostComments[];
};

//⛔
export const getPostCommentsByPostId = async ({
  postIds,
}: {
  postIds: string[];
}): Promise<GetPostCommentsByPostIdReturn> => {
  try {
    const { data, error } = await supabase
      .from("post_comments")
      .select("*")
      .in("post_id", postIds); // 篩選相關文章的按讚數

    if (error) {
      console.log("取得文章留言失敗", error);
      return {
        success: false,
        errorMessage: (error as Error).message,
        data: [],
      };
    }

    const transformedPostComments = transformPostComments({
      postComments: data,
    });

    return {
      success: true,
      data: transformedPostComments,
    };
  } catch (error) {
    console.log("取得文章留言失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

//☑️更新文章按讚、收回讚
export const updatePostLikeDB = async ({
  postId,
  userId,
  like,
}: {
  postId: string;
  userId: string;
  like: boolean;
}): Promise<Result> => {
  try {
    // 按讚
    if (like) {
      const { error } = await supabase.from("post_likes").upsert(
        { post_id: postId, user_id: userId },
        {
          onConflict: "post_id, user_id",
        }
      );
      if (error) {
        return {
          success: false,
          errorMessage: error.message,
        };
      }

      // 收回讚
    } else {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (error) {
        return {
          success: false,
          errorMessage: error.message,
        };
      }
    }
    return { success: true };
  } catch (error) {
    console.log("更新文章按讚失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

type GetPostLikesWithUsers = Result & {
  data: PostLikeUser[];
};

// ☑️取得文章按讚者資訊
export const getPostLikesWithUsers = async ({
  currentUserId,
  postIds,
}: {
  currentUserId: string;
  postIds: string[];
}): Promise<GetPostLikesWithUsers> => {
  try {
    // 查詢文章按讚
    const { data: postLikesData, error: postLikesError } = await supabase
      .from("post_likes")
      .select("*")
      .in("post_id", postIds);

    if (postLikesError) {
      console.log("取得文章按讚失敗", postLikesError);
      return {
        success: false,
        errorMessage: (postLikesError as Error).message,
        data: [],
      };
    }

    // 提取按讚者 ID
    const userIds = postLikesData.map((like) => like.user_id);

    // 查詢所有按讚者詳細資料
    const { data: usersData } = await getUsersDetail({
      userIds: userIds,
    });

    // const { data: usersData, error: usersError } = await supabase
    //   .from("users")
    //   .select(
    //     `
    //     id,
    //     name,
    //     gender,
    //     introduce,
    //     birthday,
    //     email,
    //     created_at,
    //     updated_at,
    //     user_head_shot(image_url, image_type),
    //     user_selected_option(interests, favorite_food, disliked_food)
    //     `
    //   )
    //   .in("id", userIds);

    // if (usersError) {
    //   console.error("Error fetching users:", usersError);
    //   return {
    //     success: false,
    //     errorMessage: (usersError as Error).message,
    //     data: [],
    //   };
    // }

    // const transformedUsers = usersData.map((user) =>
    //   transformUser({
    //     users: user,
    //     userHeadShot: user.user_head_shot as unknown as UserHeadShotDBType,
    //     userSelectedOption:
    //       user.user_selected_option as unknown as UserSelectedOptionDBType,
    //   })
    // );

    // 查詢好友列表
    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .in("user_id", userIds);

    if (friendsError) {
      console.log("取得好友列表失敗", friendsError);
      return {
        success: false,
        errorMessage: (friendsError as Error).message,
        data: [],
      };
    }

    const friendList = friendsData?.map((friend) => friend.friend_id);

    // 合併文章按讚和按讚者資訊
    const combinedPostLikesUsers = postLikesData.map((like) => {
      const user = usersData.find((user) => user.userId === like.user_id)!;
      const userState = (
        like.user_id === currentUserId
          ? "personal"
          : friendList.includes(like.user_id)
          ? "friend"
          : "visitor"
      ) as UserState;

      return {
        user: {
          ...user,
          userState,
        },
        postId: like.post_id,
        createdAt: like.created_at,
        // userId: like.user_id,
      };
    });
    return {
      success: true,
      data: combinedPostLikesUsers,
    };
  } catch (error) {
    console.log("取得文章按讚失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};
