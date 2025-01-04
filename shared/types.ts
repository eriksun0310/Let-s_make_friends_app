export type IsValidItem = {
  value: boolean;
  errorText: string;
};

export type LoginIsValid = {
  email: IsValidItem;
  password: IsValidItem;
};
export type LoginForm = Omit<Form, "confirmPassword">;

export type RegisterIsValid = {
  email: IsValidItem;
  password: IsValidItem;
  confirmPassword: IsValidItem;
};

export type Form = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type ImageType = "people" | "animal";

export type HeadShot = {
  imageType: ImageType;
  imageUrl: string;
};

export type Tab = "interests" | "favoriteFood" | "dislikedFood";

export type Tabs = {
  [key in Tab]: string;
};

export type OptionList = {
  interests: { [key: string]: string };
  favoriteFood: { [key: string]: string };
  dislikedFood: { [key: string]: string };
};

export interface SelectedOption {
  [key: string]: string[];
}

export type Gender = "female" | "male";

export type Users = {
  userId: string;
  name: string;
  gender: Gender;
  introduce: string;
  birthday: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  userId: string;
  name: string;
  gender: Gender;
  introduce: string;
  birthday: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;

  headShot: HeadShot;
  selectedOption: SelectedOption;
};

export type UserState = "personal" | "friend" | "visitor";

export type FriendState = "add" | "accepted";

export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export type FriendRequest = {
  id: string;
  receiverId: string;
  senderId: string;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
};

export type EditUserFieldName =
  | "name"
  | "introduce"
  | "headShot"
  | "selectedOption";

export type Screen = "userInfo" | "aboutMe";

export type Message = {
  id: string;
  chatRoomId: string;
  content: string;
  isRead: boolean;
  recipientId: string;
  senderId: string;
  createdAt: Date;
};

export type ChatRoom = {
  id: string;
  user1Id: string;
  user2Id: string;
  user1Deleted: boolean;
  user2Deleted: boolean;
  user1DeletedAt: Date;
  user2DeletedAt: Date;
  lastTime: Date;
  lastMessage: string;
  unreadCountUser1: number;
  unreadCountUser2: number;
  friend: User;
  createdAt: Date;
};

export type ChatRoomState = "old" | "new";

export type Result = {
  success: boolean;
  errorMessage?: string;
};

// 文章權限
export type PostVisibility = "public" | "friends";

export type PostTags = {
  id: string;
  postId: string;
  tag: string;
};

export type Post = {
  id: string;
  userId: string;
  content: string;
  visibility: PostVisibility;
  createdAt: Date;
  updatedAt: Date;
};

export type PostComments = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostLikes = {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
};

/*

TODO:
1. 發文者的資訊:users
2. 標籤:post_tags
3. 留言數:post_comments
4. 按讚數:post_likes
5. 文章內容:posts
*/

/*
TODO:
1. 發文者資料: users
2. 留言者資料: users
3. 按讚者資料: post_likes + users 
4. 發文內容: posts
5. 留言內容: post_comments
6. 是否有tag: post_tags
*/
export type PostDetail = {
  post: Post;
  user: User;
  tags: string[];
  postLikes: PostLikes[];
  postComments: PostComments[];
};

//新增文章
export type NewPost = {
  userId: string;
  content: string;
  visibility: PostVisibility;
  tags: string[];
};

// 更新文章
export type UpdatedPost = NewPost & {
  postId: string;
};

export interface SegmentedButtons {
  value: string;
  label: string;
}

//新增跟更新的貼文
export type AddANDUpdatePost = {
  post: Post;
  tags: string[];
  postLikes: PostLikes[];
  postComments: PostComments[];
};

export type EditPost = Pick<PostDetail, "post" | "tags">;
