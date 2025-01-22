import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/userInfo/HeadShot";
import { Colors } from "../constants/style";
import UserCollapse from "../components/userInfo/UserCollapse";
import PostPermissionsSettings from "../components/post/PostPermissionsSettings";
import Post from "../components/post/Post";
import {
  SegmentedButtonType,
  User,
  FriendScreen,
  UserState,
} from "../shared/types";
import { PaperProvider } from "react-native-paper";
import BackButton from "../components/ui/button/BackButton";
import Button from "../components/ui/button/Button";
import { MessageCircleMore, Settings2 } from "lucide-react-native";
import CustomIcon from "../components/ui/button/CustomIcon";
import {

  selectPosts,
  selectUser,
  setCurrentChatRoomId,
  setUserSettings,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { getUserSettings } from "../util/handleUserEvent";
import { getChatRoomDetail, getMessages } from "util/handleChatEvent";
import { resetDeleteChatRoomState } from "shared/chat/chatFuncs";
import { logout } from "components/hooks/useAppLifecycle";

interface UserInfoProps {
  route: {
    params: {
      userState: UserState;
      friend: User;
      screen: FriendScreen;
    };
  };
  navigation: NavigationProp<any>;
}

export const postList = Array.from({ length: 335 }, (_, index) => ({
  date: `${index + 1} `,
}));

const UserInfo: React.FC<UserInfoProps> = ({ route, navigation }) => {
  const { userState, friend, screen } = route.params || {
    userState: "personal",
  };

  const [permissions, setPermissions] = useState<SegmentedButtonType>("all");

  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const postData = useAppSelector(selectPosts);

  // 判斷 要取 個人還是好友 資料
  const user = userState === "personal" ? personal : friend;

  //登出
  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigation.navigate("login");
    });
  };

  // 進入1對1聊天室
  const handleChatRoomPress = async () => {
    const { data: chatRoom } = await getChatRoomDetail({
      userId: personal.userId,
      friendId: friend.userId,
    });

    // 開始加載聊天紀錄
    const { data: messages } = await getMessages({
      chatRoomId: chatRoom?.id || "",
      userId: personal.userId,
    });
    dispatch(setCurrentChatRoomId(chatRoom?.id));

    navigation.navigate("chatDetail", {
      chatRoomState: chatRoom?.id ? "old" : "new", //  區分新舊聊天室
      chatRoom: {
        id: chatRoom?.id,
        friend: friend,
      },
      messages: messages,
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
  const hasMyPost = postData?.some(
    (post) => post?.user?.userId === user.userId
  );

  // 過濾掉不符合的文章權限
  const filteredPost = postData?.filter((post) => {
    if (permissions === "all") {
      return true;
    } else {
      return post.post.visibility === permissions;
    }
  });

  const handleHeaderRight = ({
    userState,
  }: {
    userState: UserState;
    screen: FriendScreen;
  }) => {
    if (userState === "friend") {
      return (
        <CustomIcon onPress={handleChatRoomPress}>
          <MessageCircleMore color={Colors.icon} />
        </CustomIcon>
      );
    } else if (userState === "personal") {
      return (
        <CustomIcon onPress={handleSettingsPress}>
          <Settings2 color={Colors.icon} />
        </CustomIcon>
      );
    } else return null;
  };

  useEffect(() => {
    navigation.setOptions({
      title: userState === "personal" ? "個人資料" : `${user.name}個人資料`,
      headerTitleAlign: "center",
      headerLeft: () => {
        if (userState !== "personal") {
          return <BackButton onPress={() => navigation.goBack()} />;
        } else return null;
      },
      headerRight: () =>
        handleHeaderRight({
          userState,
          screen,
        }),
    });
  }, [navigation, userState]);

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

          {/* TODO：😵‍💫 想一下需不需要 */}
          {/* {userState !== "personal" && (
            <ActionButton
              friend={friend}
              userState={userState}
              screen={screen}
            />
          )} */}

          <UserCollapse
            userState={userState}
            navigation={navigation}
            user={user}
          />
          <View style={{ marginTop: 10 }} />

          {hasMyPost && userState === "personal" && (
            <PostPermissionsSettings
              permissions={permissions}
              setPermissions={setPermissions}
            />
          )}

          <View style={{ marginTop: 10 }} />

          {filteredPost?.map((post) => {
            if (post?.user?.userId === user.userId) {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("postDetail", {
                      postId: post.post.id,
                    })
                  }
                >
                  <Post screen="home" userState={userState} postDetail={post} />
                </TouchableOpacity>
              );
            }
          })}

          {userState === "personal" && (
            <View style={styles.formContainer}>
              <Button
                style={{ width: "50%" }}
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
  buttonView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    width: "20%",
    marginHorizontal: 32,
  },
});

export default UserInfo;
