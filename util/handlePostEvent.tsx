/*
處理 發文的 db 操作
tags: 所有可用的標籤
post_tags: 文章標籤
posts: 文章
post_comments: 文章留言
post_likes: 文章按讚
*/

import { PostsDBType, PostTagsDBType } from "../shared/dbType";
import {
  transformPost,
  transformPostComments,
  transformPostDetail,
  transformPostLikes,
  transformPostTags,
} from "../shared/post/postUtils";
import {
  AddANDUpdatePost,
  NewPost,
  PostComments,
  PostDetail,
  PostLikes,
  PostTags,
  Result,
  UpdatedPost,
  User,
} from "../shared/types";
import {
  getFriendDetail,
  getFriendDetails,
  getFriendList,
} from "./handleFriendsEvent";
import { supabase } from "./supabaseClient";

// ✅ 取得 所有的tag(for: 新增文章用的)
export const getTags = async (): Promise<{
  success: boolean;
  errorMessage?: string;
  data: string[];
}> => {
  const { data: tagsData, error } = await supabase.from("tags").select("name");

  if (error) {
    console.error("Error fetching post tags:", error);
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
};

//✅ 新增 文章標籤
export const addPostTag = async ({
  tagIds,
  postId,
}: {
  tagIds: string[];
  postId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
}> => {
  try {
    const tagsData = tagIds.map((tagId) => ({
      tag_id: tagId,
      post_id: postId,
    }));

    console.log("tagsData", tagsData);
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
    console.log("新增標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ✅ 新增所有可用標籤 - origin
export const addTags1 = async ({
  tags,
  postId,
}: {
  tags: string[];
  postId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: string[];
}> => {
  try {
    const tagIds = await Promise.all(
      tags.map(async (tag) => {
        const { data: existingTag } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tag)
          .single();

        if (existingTag) {
          return existingTag.id; // 如果標籤已存在,返回標籤的ID
        } else {
          const { data: newTag } = await supabase
            .from("tags")
            .insert({ name: tag })
            .select("*")
            .single();

          console.log("newTag", newTag);
          return newTag.id; // 如果標籤不存在,創建新標籤後返回新標籤的ID
        }
      })
    );

    // 新增文章標籤
    await addPostTag({
      tagIds: tagIds,
      postId: postId,
    });

    return {
      success: true,
      data: tags,
    };
  } catch (error) {
    console.log("新增標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

// export const addTags = async ({
//   tags,
//   postId,
// }: {
//   tags: string[];
//   postId: string;
// }): Promise<{
//   success: boolean;
//   errorMessage?: string;
//   data: string[];
// }> => {
//   try {
//     // 一次查詢所有標籤是否存在
//     const { data: existingTags, error: existingError } = await supabase
//       .from("tags")
//       .select("id, name")
//       .in("name", tags);

//     if (existingError) {
//       console.log("新增標籤失敗", existingError);
//       return {
//         success: false,
//         errorMessage: (existingError as Error).message,
//         data: [],
//       };
//     }

//     const existingTagNames = existingTags?.map((tag) => tag.name);

//     const newTagNames = tags.filter((tag) => !existingTagNames.includes(tag));

//     // 插入不存在的標籤
//     let newTags = [];
//     if (newTagNames.length > 0) {
//       const { data: insertedTags, error: insertError } = await supabase
//         .from("tags")
//         .insert(newTagNames.map((name) => ({ name })))
//         .select("*");

//       if (insertError) {
//         console.log("新增標籤失敗", insertError);
//         return {
//           success: false,
//           errorMessage: (insertError as Error).message,
//           data: [],
//         };
//       }

//       newTags = insertedTags;
//     }

//     //合併新舊標籤的ID
//     const allTagIds = [...existingTags, ...newTags].map((tag) => tag.id);

//     // 新增文章標籤
//     await addPostTag({
//       tagIds: allTagIds,
//       postId: postId,
//     });

//     return {
//       success: true,
//       data: tags,
//     };
//   } catch (error) {
//     console.log("新增標籤失敗", error);
//     return {
//       success: false,
//       errorMessage: (error as Error).message,
//       data: [],
//     };
//   }
// };

// export const addTags = async({
//      tags,
//      postId
// }: {
//      tags: string[];
//    postId: string;
//    }):Promise<{
//     success: boolean;
//     errorMessage?: string;
//     data: { tag_id: string; name: string }[]; // 返回完整的標籤資料
//    }>=>{
//   try{
//     // 使用upsert 一次性處理標籤新增或返回已存在的標籤
//     const {data:allTags , error:tagError} = await supabase
//     .from('tags')
//     .upsert(tags.map((name)=>({ name})), {onConflict:'name'})
//     .select('*')

//     if(tagError){
//       console.log("新增標籤失敗", tagError);
//       return {
//         success:false,
//         errorMessage:(tagError as Error).message,
//         data:[]
//       }
//     }

//     // 提取所有標籤的id
//     const tagIds = allTags.map((tag)=>tag.tag_id)

//     // 新增文章標籤
//     const {success, errorMessage } = await addPostTag({
//       tagIds,
//       postId
//     })

//     if(!success){
//       return {
//         success:false,
//         errorMessage,
//         data:[]
//       }
//     }
//     // 返回完整的標籤資料
//     return {
//       success:true,
//       data:allTags
//     }
//   }catch(error){

//     console.log("新增標籤失敗", error);
//     return {
//       success:false,
//       errorMessage:(error as Error).message,
//       data:[]
//     }
//   }
// }

export const addTags = async ({
  tags,
  postId,
}: {
  tags: string[];
  postId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: { id: string; name: string }[]; // 返回完整的標籤資料
}> => {
  try {
    // 使用 upsert 一次性處理標籤新增或返回已存在的標籤
    const { data: allTags, error: tagError } = await supabase
      .from("tags")
      .upsert(
        tags.map((name) => ({ name })),
        { onConflict: "name" }
      )
      .select("*");

    if (tagError) {
      console.log("新增標籤失敗", tagError);
      return {
        success: false,
        errorMessage: tagError.message,
        data: [],
      };
    }

    console.log("新增標籤成功", allTags);
    // 提取所有標籤的 ID
    const tagIds = allTags.map((tag) => tag.id);

    // 新增文章標籤
    const { success, errorMessage } = await addPostTag({
      tagIds,
      postId,
    });

    if (!success) {
      return {
        success: false,
        errorMessage,
        data: [],
      };
    }

    // 返回完整的標籤資料
    return {
      success: true,
      data: allTags,
    };
  } catch (error) {
    console.log("新增標籤失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

//✅ 取得文章內的tag
export const getPostTags = async ({
  postIds,
}: {
  postIds: string[];
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: PostTags[];
}> => {
  try {
    const { data: postTags, error } = await supabase
      .from("post_tags")
      .select("post_id , tag_id");

    if (error) {
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

    //console.log("transformedPostTags", transformedPostTags);

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

// 取得所有文章(好友 + 自己+ 非好友但設為公開)的文章

// TODO:　return 回來的資料應該是要包含 發文者的資訊、標籤、留言數、按讚數
/*
⛔ 未測試
將好友移除後 朋友的貼文不會顯示


✅ 已測試
公開的貼文: 不管是好友還是非好友都會顯示
朋友的貼文: 只有朋友可以看到
*/
export const getAllPosts = async ({
  userId,
}: {
  userId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: PostDetail[];
}> => {
  try {
    // 取得好友資訊
    const { data: friendList } = await getFriendList(userId);

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
    const users = await getFriendDetails(userIds);

    // 取得文章標籤
    const tagsData = (await getPostTags({ postIds })).data;

    // 查詢文章按讚
    const likesData = (await getPostLikesByPostId({ postIds })).data;

    // 查詢文章留言
    const commentsData = (await getPostCommentsByPostId({ postIds })).data;

    const postDetails = postsData.map((post) => {
      // 找到對應的發文者資訊
      const user = users.find((user) => user.userId === post.user_id);

      // 過濾對應的標籤、按讚數和留言
      const tags = tagsData.filter((tag) => tag.postId === post.id);
      const likes = likesData.filter((like) => like.postId === post.id);
      const comments = commentsData.filter(
        (comment) => comment.postId === post.id
      );

      const transformedPost = transformPost({
        posts: post,
      });

      // 轉換文章詳情
      const transformedPostDetail = {
        post: transformedPost,
        user: user || ({} as User),
        tags: tags?.map((tag) => tag.tag) || [],
        postLikes: likes,
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

//✅ 取得文章的詳細資訊
export const getPostDetail = async ({
  post,
}: {
  post: PostsDBType;
}): Promise<PostDetail> => {
  // 轉換文章的資料格式
  const transformedPost = transformPost({
    posts: post,
  });

  // 取得發文者資訊
  const user = (await getFriendDetail(post.user_id)) || ({} as User);

  // 取得文章標籤
  const tagsData = (await getPostTags({ postIds: [post.id] })).data;
  console.log("tagsData 2222222", tagsData);
  // 過濾對應文章的標籤
  const findTagsData = tagsData.filter((tag) => tag.postId === post.id);
  console.log("findTagsData 222222", findTagsData);
  // 查詢文章按讚
  const likesData = (await getPostLikesByPostId({ postIds: [post.id] })).data;

  // 查詢文章留言
  const commentsData = (await getPostCommentsByPostId({ postIds: [post.id] }))
    .data;

  return {
    user: user,
    post: transformedPost,
    tags: findTagsData.map((tag) => tag.tag),
    postLikes: likesData,
    postComments: commentsData,
  };
};

//✅ 新增文章
export const addPostDB = async ({
  newPost,
}: {
  newPost: NewPost;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: AddANDUpdatePost | null;
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
        data: null,
      };
    }

    const newPostId = postData?.id; // 取得新增文章的 id

    // 新增標籤
    const { data: tags } = await addTags({
      tags: newPost.tags,
      postId: newPostId,
    });

    console.log("tags", tags);
    // 發文者的基本資訊
    //const user = await getFriendDetail(postData.user_id);

    // 轉換文章的資料格式
    const transformedPost = transformPost({
      posts: postData,
    });

    return {
      success: true,
      data: {
        post: transformedPost,
        tags: tags?.map((tag) => tag.name) || [], // 如果標籤新增失敗，返回空陣列
        postLikes: [], // 新文章沒有按讚
        postComments: [], // 新文章沒有留言
      },
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

//  更新文章
export const updatePostDB = async ({
  updatedPost,
}: {
  updatedPost: UpdatedPost;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: AddANDUpdatePost | null;
}> => {
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

    // 更新標籤
    /*

    1.先刪除 post_tags 中舊標籤
    2.addTags：返回 tagIds
    3. addPostTag：新增文章標籤
    */

    // const { error: deletePostTagsError } = await supabase
    //   .from("post_tags")
    //   .delete()
    //   .in("post_id", [updatedPost.postId]);

    // if (deletePostTagsError) {
    //   return {
    //     success: false,
    //     errorMessage: deletePostTagsError.message,
    //     data: null,
    //   };
    // }

    // 新增標籤
    // const { data: tags } = await addTags({
    //   tags: updatedPost.tags,
    //   postId: updatedPost.postId,
    // });

    // // 轉換文章的資料格式
    // const transformedPost = transformPost({
    //   posts: data,
    // });
    //console.log("updatePostDB tags", tags);
    return {
      success: true,
      data: {
        post: transformedPost,
        tags: tags?.map((tag) => tag.name) || [], // 如果標籤新增失敗，返回空陣列
        postLikes: [], //TODO: 到時候再改
        postComments: [], //TODO: 到時候再改
      },
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

//⛔ 刪除文章
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
*/
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
    const transformedPostLikes = transformPostLikes({
      postLikes: data,
    });

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
*/
export const getPostCommentsByPostId = async ({
  postIds,
}: {
  postIds: string[];
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data: PostComments[];
}> => {
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
