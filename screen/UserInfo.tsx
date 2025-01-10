import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/userInfo/HeadShot";
import { Colors } from "../constants/style";
import UserCollapse from "../components/userInfo/UserCollapse";
import PostPermissionsSettings from "../components/post/PostPermissionsSettings";
import Post from "../components/post/Post";
import { SegmentedButtonType, User, UserState } from "../shared/types";
import { PaperProvider } from "react-native-paper";
import BackButton from "../components/ui/button/BackButton";
import Button from "../components/ui/button/Button";
import { MessageCircleMore, Settings2 } from "lucide-react-native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { getChatRoomDetail, getMessages } from "../util/handleChatEvent";
import {
  logout,
  selectPosts,
  selectUser,
  setCurrentChatRoomId,
  setUserSettings,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { resetDeleteChatRoomState } from "../shared/chat/chatFuncs";
import { getUserSettings } from "../util/handleUserEvent";

interface UserInfoProps {
  route: {
    params: {
      userState: UserState;
      friend: User;
      isShowMsgIcon: boolean; // 是否顯示聊天按鈕(只有成為好友才顯示)
    };
  };
  navigation: NavigationProp<any>;
}

export const postList = Array(14).fill({
  date: "2024/08/02",
});

const UserInfo: React.FC<UserInfoProps> = ({ route, navigation }) => {
  const {
    userState,
    friend,
    isShowMsgIcon = false,
  } = route.params || { userState: "personal" };

  const [permissions, setPermissions] = useState<SegmentedButtonType>("all");

  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const postData = useAppSelector(selectPosts);

  // 判斷 要取 個人還是好友 資料
  const user = userState === "personal" ? personal : friend;

  //登出
  const handleLogout = () => {
    dispatch(logout(personal.userId)).then(() => {
      navigation.navigate("login");
    });
  };

  // 進入1對1聊天室
  const handleChatRoomPress = async () => {
    const chatRoom = await getChatRoomDetail({
      userId: personal.userId,
      friendId: friend.userId,
    });

    // 開始加載聊天紀錄
    const messages = await getMessages({
      chatRoomId: chatRoom.id,
      userId: personal.userId,
    });
    dispatch(setCurrentChatRoomId(chatRoom.id));

    navigation.navigate("chatDetail", {
      chatRoomState: chatRoom.id ? "old" : "new", //  區分新舊聊天室
      chatRoom: {
        id: chatRoom?.id,
        friend: friend,
      },
      messages: messages?.data,
    });

    // 重製聊天室狀態
    resetDeleteChatRoomState({
      chatRoom: chatRoom,
      userId: personal.userId,
    });
  };

  // 設定
  const handleSettingsPress = () => {
    navigation.navigate("settings");
  };

  // 檢查文章是否為自己發的
  const hasMyPost = postData?.some((post) => post.user.userId === user.userId);

  // 過濾掉不符合的文章權限
  const filteredPost = postData?.filter((post) => {
    if (permissions === "all") {
      return true;
    } else {
      return post.post.visibility === permissions;
    }
  });

  useEffect(() => {
    // console.log("好友資料 当前导航堆栈:", navigation.getState());
    navigation.setOptions({
      title: userState === "personal" ? "個人資料" : "好友資料",
      headerTitleAlign: "center",
      headerLeft: () => {
        if (userState === "friend") {
          return <BackButton onPress={() => navigation.goBack()} />;
        } else return null;
      },
      headerRight: () => {
        if (isShowMsgIcon) {
          return (
            <CustomIcon onPress={handleChatRoomPress}>
              <MessageCircleMore color={Colors.icon} />
            </CustomIcon>
          );
        } else if (userState === "personal") {
          return (
            <CustomIcon onPress={handleSettingsPress}>
              <Settings2 color={Colors.icon} />
              {/* <Wrench color={Colors.icon} /> */}
              {/* <Settings color={Colors.icon} /> */}
              {/* <MessageCircleMore color={Colors.icon} /> */}
            </CustomIcon>
          );
        } else return null;
      },
    });
  }, [navigation, userState, isShowMsgIcon]);

  console.log("userState", userState);

  useEffect(() => {
    // 取得用戶設定資料
    const fetchUserSettings = async () => {
      const { success: userSettingsSuccess, data } = await getUserSettings({
        userId: personal.userId,
      });

      if (userSettingsSuccess) {
        dispatch(setUserSettings(data));
      }
    };

    fetchUserSettings();
  }, [personal.userId]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 大頭貼 */}
          <HeadShot
            userState={userState}
            screen="userInfo"
            nameValue={user.name}
            navigation={navigation}
            headShot={user.headShot}
          />

          <UserCollapse
            userState={userState}
            navigation={navigation}
            user={user}
          />
          <View
            style={{
              marginTop: 10,
            }}
          />

          {hasMyPost && userState === "personal" && (
            <PostPermissionsSettings
              permissions={permissions}
              setPermissions={setPermissions}
            />
          )}

          <View style={{ marginTop: 10 }} />

          {filteredPost?.map((post) => {
            if (post.user.userId === user.userId) {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("postDetail", {
                      postId: post.post.id,
                    })
                  }
                >
                  <Post
                    screen="home"
                    // userState={
                    //   post.user.userId === personal.userId
                    //     ? "personal"
                    //     : "friend"
                    // } // 這個到時候 要看說是訪客還是朋友
                    userState={userState}
                    postDetail={post}
                  />
                </TouchableOpacity>
              );
            }
          })}

          {userState === "personal" && (
            <View style={styles.formContainer}>
              <Button
                style={{
                  width: "50%",
                }}
                text="登出"
                onPress={handleLogout}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    display: "flex",
    marginVertical: 30,
    alignItems: "center",
  },
});

export default UserInfo;
