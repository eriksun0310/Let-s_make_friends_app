import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/userInfo/HeadShot";
import { Colors } from "../constants/style";
import UserCollapse from "../components/userInfo/UserCollapse";
import PostPermissionsSettings from "../components/post/PostPermissionsSettings";
import Post from "../components/post/Post";
import { User, UserState } from "../shared/types";
import { PaperProvider } from "react-native-paper";
import BackButton from "../components/ui/button/BackButton";
import Button from "../components/ui/button/Button";
import { MessageCircleMore } from "lucide-react-native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { getChatRoomDetail, getMessages } from "../util/handleChatEvent";
import {
  logout,
  selectUser,
  setCurrentChatRoomId,
  useAppDispatch,
  useAppSelector,
} from "../store";

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

  // 是否有未讀分隔符
  // const [hasUnreadSeparator, setHasUnreadSeparator] = useState(false);

  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);

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

    // let processedData = [];
    // 舊聊天室
    // if (chatRoom.id) {
    //   const { processedChatData } = getProcessedChatData({
    //     chatRoom,
    //     userId: personal.userId,
    //     messagesData: messages.data,
    //   });

    //   processedData = processedChatData;
    // }

    navigation.navigate("chatDetail", {
      chatRoomState: chatRoom?.id ? "old" : "new", //  區分新舊聊天室
      chatRoom: {
        id: chatRoom?.id,
        friend: friend,
      },
      messages: messages,
      // hasUnreadSeparator: hasUnreadSeparator, // 傳遞分隔符狀態
      // setHasUnreadSeparator: setHasUnreadSeparator,
    });
  };

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
        } else return null;
      },
    });
  }, [navigation, userState, isShowMsgIcon]);
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

          {userState === "personal" && <PostPermissionsSettings />}

          <View style={{ marginTop: 10 }} />

          {postList?.map((post) => (
            <TouchableOpacity onPress={() => navigation.navigate("postDetail")}>
              <Post userState="personal" date={post.date} user={user} />
            </TouchableOpacity>
          ))}

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
