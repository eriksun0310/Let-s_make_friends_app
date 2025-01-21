import React, { useEffect } from "react";
import { AppState } from "react-native";
import {
  selectUser,
  setBeAddFriends,
  setChatRooms,
  setFriendList,
  setFriendRequests,
  setFriendRequestUnRead,
  setPosts,
  useAppDispatch,
  useAppSelector,
} from "store";
import { getAllChatRooms } from "util/handleChatEvent";
import {
  getBeFriendUsers,
  getFriendList,
  getFriendRequests,
} from "util/handleFriendsEvent";
import { getAllPosts } from "util/handlePostEvent";

//
const useAppStateFetcher = () => {
  console.log("aaaaaaaaaa");
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser); // 直接在 Hook 中使用

  const userId = personal.userId;

  // 可以成為好友的用戶資料
  const fetchBeFriendUsers = async () => {
    const { data: userData } = await getBeFriendUsers({
      currentUserId: personal.userId,
    });
    // console.log("userData", userData);

    dispatch(setBeAddFriends(userData));
  };

  // 取得其他用戶寄送的交友邀請
  const fetchFriendRequests = async () => {
    const { data } = await getFriendRequests({ userId: userId });
    // console.log("getFriendRequests data", data);
    dispatch(setFriendRequests(data));
    // 更新未讀的好友邀請數量
    dispatch(
      setFriendRequestUnRead(data.filter((req) => req.isRead === false).length)
    );
  };

  // 取得好友列表
  const fetchFriendList = async () => {
    const { data, success } = await getFriendList({
      currentUserId: userId,
    });

    if (success) {
      dispatch(setFriendList(data));
    }
  };

  // 取得首頁文章
  const fetchAllPosts = async () => {
    const { data: allPosts, success } = await getAllPosts({
      userId: personal.userId,
    });

    if (success) {
      dispatch(setPosts(allPosts));
    }
  };

  // 取得所有聊天室
  const fetchChatData = async () => {
    const { data: rooms, success } = await getAllChatRooms({
      userId: personal.userId,
    });
    if (success) {
      dispatch(setChatRooms(rooms));
    }
  };

  useEffect(() => {
    const handleAppStateChange = async (state: string) => {
      console.log("state ====>", state);
      if (state === "active") {
        fetchAllPosts();
        fetchBeFriendUsers();
        fetchFriendRequests();
        fetchFriendList();
        fetchChatData();
      }

      // await fetchFriendRequests(); // 初始化時拉取數據
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);
};

export default useAppStateFetcher;
