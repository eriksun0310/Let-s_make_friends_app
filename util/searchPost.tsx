/*
1.A1 發了文章,文章內容 Hi 大家好 文章顯示範圍限於朋友 A2 按讚該文章, 並留言 Hi  
2.A3 發了文章 Hi 設為公開, A1 可以看到文章  
3.A4 看不到 A1 的文章,因為不為好友
*/

// 1. A1 發文，並設定為好友可見
const createPost = async (userId, content, visibility) => {
  const postRef = firebase.firestore().collection("posts").doc();
  const postId = postRef.id;

  const postData = {
    authorId: userId,
    content,
    visibility,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  const batch = firebase.firestore().batch();

  // 寫入貼文
  batch.set(postRef, postData);

  // 更新用戶貼文索引
  batch.set(
    firebase.firestore().collection("userPosts").doc(userId),
    {
      [postId]: {
        createdAt: postData.createdAt,
        visibility: visibility,
      },
    },
    { merge: true }
  );

  await batch.commit();
  return postId;
};

// 2. A2 對 A1 的貼文按讚和留言
const likePost = async (userId, postId) => {
  const batch = firebase.firestore().batch();

  // 更新貼文讚數
  batch.update(firebase.firestore().collection("posts").doc(postId), {
    likeCount: firebase.firestore.FieldValue.increment(1),
  });

  // 記錄按讚資訊
  batch.set(
    firebase.firestore().collection("postInteractions").doc(postId),
    {
      likes: {
        [userId]: {
          timestamp: new Date().toISOString(),
        },
      },
    },
    { merge: true }
  );

  await batch.commit();
};

const commentPost = async (userId, postId, content) => {
  const batch = firebase.firestore().batch();
  const commentId = firebase.firestore().collection("temp").doc().id;

  // 更新貼文留言數
  batch.update(firebase.firestore().collection("posts").doc(postId), {
    commentCount: firebase.firestore.FieldValue.increment(1),
  });

  // 記錄留言
  batch.set(
    firebase.firestore().collection("postInteractions").doc(postId),
    {
      comments: {
        [commentId]: {
          authorId: userId,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
    { merge: true }
  );

  await batch.commit();
};

// 3. 取得可見的貼文（考慮好友關係和可見性）
const getVisiblePosts = async (userId) => {
  // 先獲取用戶的好友列表
  const friendshipsDoc = await firebase
    .firestore()
    .collection("friendships")
    .doc(userId)
    .get();
  const friendIds = Object.keys(friendshipsDoc.data()?.friends || {});

  // 獲取所有貼文
  const postsSnapshot = await firebase
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get();

  // 過濾可見的貼文
  return postsSnapshot.docs
    .filter((doc) => {
      const post = doc.data();
      return (
        post.visibility === "public" || // 公開貼文
        post.authorId === userId || // 自己的貼文
        (post.visibility === "friends-only" &&
          friendIds.includes(post.authorId)) // 好友的貼文
      );
    })
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
};
