import React from "react";
import {
  setBeAddFriends,
  setChatRooms,
  setFriendList,
  setFriendRequests,
  setFriendRequestUnRead,
  setPosts,
} from "store";
import { AppDispatch } from "store/store";
import { getAllChatRooms } from "util/handleChatEvent";
import {
  getBeFriendUsers,
  getFriendList,
  getFriendRequests,
} from "util/handleFriendsEvent";
import { getAllPosts } from "util/handlePostEvent";

export const fetchAllData = async ({
  dispatch,
  userId,
}: {
  dispatch: AppDispatch;
  userId: string;
}) => {
  try {
    // 可以成為好友的用戶資料
    const { data: beFriendUsers } = await getBeFriendUsers({
      currentUserId: userId,
    });
    // 取得其他用戶寄送的交友邀請
    const { data: friendRequests } = await getFriendRequests({
      userId: userId,
    });

    // 取得好友列表
    const { data: friendList } = await getFriendList({
      currentUserId: userId,
    });

    // 取得首頁文章
    const { data: allPosts } = await getAllPosts({
      userId: userId,
    });

    // 取得所有聊天室
    const { data: rooms } = await getAllChatRooms({
      userId: userId,
    });

    // 分別 把資料存到redux
    dispatch(setBeAddFriends(beFriendUsers));

    dispatch(setFriendRequests(friendRequests));
    // 更新未讀的好友邀請數量
    dispatch(
      setFriendRequestUnRead(
        friendRequests.filter((req) => req.isRead === false).length
      )
    );

    dispatch(setFriendList(friendList));

    dispatch(setPosts(allPosts));

    dispatch(setChatRooms(rooms));
  } catch (error) {
    console.log("取得用戶資料失敗", error);
  }
};
