import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EditHeadShot from "./screen/EditHeadShot";
import {
  MessageCircle,
  House,
  UserRound,
  UserRoundPlus,
} from "lucide-react-native";
import ChatRoomList from "./screen/ChatRoomList";
import Login from "./screen/Login";
import Register from "./screen/Register";
import AboutMe from "./screen/AboutMe";
import EditUserInfo from "./screen/EditUserInfo";
import AboutMeSelectOption from "./screen/AboutMeSelectOption";
import store from "./store/store";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import Home from "./screen/Home";
import ChatDetail from "./screen/ChatDetail";
import AddFriend from "./screen/AddFriend";
import FriendList from "./screen/FriendList";
import FriendInvitation from "./screen/FriendInvitation";
import UserInfo from "./screen/UserInfo";
import PostDetail from "./screen/PostDetail";
import Search from "./screen/Search";
import "react-native-gesture-handler";
import {
  useAppSelector,
  selectInitialized,
  selectIsAuthenticated,
  selectIsNewUser,
  AppReduxProvider,
  selectFriendRequestUnRead,
  selectUser,
  selectChatRooms,
  selectNewFriendUnRead,
} from "./store";
import PostContent from "./screen/PostContent";
import Settings from "./screen/Settings";
import { View, StyleSheet } from "react-native";
import { useAppLifecycle } from "components/hooks/useAppLifecycle";
import { useFriends } from "components/hooks/useFriends";
import { useFriendRequests } from "components/hooks/useFriendRequests";
import { useChatRoomsListeners } from "components/hooks/useChatRoomsListeners";
import { useMessagesListeners } from "components/hooks/useMessagesListeners";
import { useUsersListeners } from "components/hooks/useUsersListeners";
import { useUserSelectedOptionListeners } from "components/hooks/useUserSelectedOptionListeners";
import { useUserHeadShotListeners } from "components/hooks/useUserHeadShotListeners";
import PostInteractions from "screen/PostInteractions";

// 顯示在螢幕的頁面(總是顯示所有頁面)
const Tab = createBottomTabNavigator();

// 堆疊頁面
const Stack = createStackNavigator();

const MainTabNavigator = () => {
  const personal = useAppSelector(selectUser);

  const chatRoomsData = useAppSelector(selectChatRooms);

  // 交友邀請未讀通知
  const friendRequestUnRead = useAppSelector(selectFriendRequestUnRead);

  // 新好友未讀通知
  const newFriendUnRead = useAppSelector(selectNewFriendUnRead);

  const hasUnreadMessages = chatRoomsData?.some((room) => {
    const unreadCount =
      room.user1Id === personal.userId
        ? room.unreadCountUser1
        : room.unreadCountUser2;
    return unreadCount > 0;
  });

  // 判斷加好友是否顯示紅點
  const addFriendDot = friendRequestUnRead > 0 || newFriendUnRead > 0;

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "chatRoomList") {
            return (
              <>
                <MessageCircle color={color} size={size} />
                {hasUnreadMessages && <View style={styles.dot} />}
              </>
            );
          } else if (route.name === "addFriend") {
            return (
              <>
                <UserRoundPlus color={color} size={size} />
                {addFriendDot && <View style={styles.dot} />}
              </>
            );
          } else if (route.name === "userInfoPersonal") {
            return <UserRound color={color} size={size} />;
          } else if (route.name === "home") {
            return <House color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: "#3D74DB",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="chatRoomList"
        options={{
          title: "聊天室",
          // headerShown: false,
          headerTitleAlign: "center",
        }}
        component={ChatRoomList}
      />
      <Tab.Screen
        name="home"
        options={{
          title: "首頁",
          // headerShown: false,
          headerTitleAlign: "center",
        }}
        component={Home}
      />
      <Tab.Screen
        name="addFriend"
        options={{
          title: "加好友",

          headerTitleAlign: "center",
        }}
        component={AddFriend}
      />

      <Tab.Screen
        name="userInfoPersonal"
        options={({ route }) => ({
          // title: "個人資料",
          userState: "personal",
        })}
        component={UserInfo}
      />
    </Tab.Navigator>
  );
};

// 註冊頁面(登入、註冊)
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        options={{
          title: "會員登入",
          headerShown: false,
        }}
        component={Login}
      />

      <Stack.Screen
        name="register"
        options={{
          title: "會員註冊",
          headerShown: false,
        }}
        component={Register}
      />
    </Stack.Navigator>
  );
};

// 已登入後的頁面(有驗證)
const AuthenticatedStack = () => {
  const isNewUser = useAppSelector(selectIsNewUser);
  // 是否已經登入
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // TODO：到時候需要把 所有監聽事件都放在這裡
  //(ex: 交友邀請 、新好友、聊天室、貼文按讚、貼文回覆等等)

  // 監聽 新用戶、好友變更名字或自介
  useUsersListeners();
  // 監聽 好友變更大頭貼
  useUserHeadShotListeners();
  // 監聽 好友變更喜好
  useUserSelectedOptionListeners();

  // 監聽好友邀請
  useFriendRequests();
  // 監聽新好友
  useFriends();
  // 監聽聊天室
  //useChatListeners(); // TODO: 到時候可以刪除, 因為已經 useChatRoomsListeners+ useMessagesListeners
  // 監聽聊天列表
  useChatRoomsListeners();
  //監聽聊天室的訊息
  useMessagesListeners();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated && isNewUser ? "aboutMe" : "main"}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "會員登入",
          headerShown: false,
        }}
        component={Login}
      />
      <Stack.Screen
        name="main"
        options={{
          title: "主畫面",
          headerShown: false,
        }}
        component={MainTabNavigator}
      />
      <Stack.Screen
        name="aboutMe"
        options={{
          title: "關於我",
          headerLeft: () => null, // 隱藏返回按鈕
        }}
        component={AboutMe}
      />

      <Stack.Screen
        name="chatDetail"
        options={{
          // title: "主畫面",
          headerShown: false,
        }}
        component={ChatDetail}
      />
      <Stack.Screen
        name="aboutMeSelectOption"
        component={AboutMeSelectOption}
      />

      <Stack.Screen name="editUserInfo" component={EditUserInfo} />

      <Stack.Screen name="editHeadShot" component={EditHeadShot} />

      {/* 好友列表*/}
      <Stack.Screen name="friendList" component={FriendList} />
      {/* 交友邀請*/}
      <Stack.Screen name="friendInvitation" component={FriendInvitation} />
      {/* 用戶資訊 */}
      <Stack.Screen
        name="userInfoFriend"
        options={({ route }) => ({
          title: "好友資料",
          userState: "friend",
        })}
        component={UserInfo}
      />

      {/* 文章詳細內容*/}
      <Stack.Screen name="postDetail" component={PostDetail} />

      {/* 搜尋頁面 */}
      <Stack.Screen name="search" component={Search} />
      {/* 新增文章 */}
      <Stack.Screen name="postContent" component={PostContent} />

      {/* 設定 */}
      <Stack.Screen name="settings" component={Settings} />

      {/* 貼文互動通知(按讚、留言) */}
      <Stack.Screen name="likesAndComments" component={PostInteractions} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  useAppLifecycle();
  // 應用程式初始化
  const initialized = useAppSelector(selectInitialized);
  // 是否已經登入
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!initialized) {
    return <LoadingOverlay message="loading ..." />; // 顯示載入頁面直到初始化完成
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <AppReduxProvider store={store}>
        <Navigation />
      </AppReduxProvider>
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    backgroundColor: "red",
    borderRadius: 100,
    width: 5,
    height: 5,
  },
});
