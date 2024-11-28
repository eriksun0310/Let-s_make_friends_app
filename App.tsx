import React, { useEffect } from "react";
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
import Chat from "./screen/Chat";
import Login from "./screen/Login";
import Register from "./screen/Register";
import AboutMe from "./screen/AboutMe";
import EditUserInfo from "./screen/EditUserInfo";
import AboutMeSelectOption from "./screen/AboutMeSelectOption";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import store, { RootState, useDispatch } from "./store/store";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import { initializeAuth } from "./store/userSlice";
import Home from "./screen/Home";
import ChatDetail from "./screen/ChatDetail";
import AddFriend from "./screen/AddFriend";
import FriendList from "./screen/FriendList";
import FriendInvitation from "./screen/FriendInvitation";
import UserInfo from "./screen/UserInfo";
import PostContent from "./screen/PostContent";
import Search from "./screen/Search";
import AddPost from "./screen/AddPost";
import 'react-native-gesture-handler';




// 顯示在螢幕的頁面(總是顯示所有頁面)
const Tab = createBottomTabNavigator();

// 堆疊頁面
const Stack = createStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      // initialRouteName="map"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "chat") {
            return <MessageCircle color={color} size={size} />;
          } else if (route.name === "addFriend") {
            return <UserRoundPlus color={color} size={size} />;
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
        name="chat"
        options={{ title: "聊天室", headerTitleAlign: "center" }}
        component={Chat}
      />
      <Tab.Screen
        name="home"
        options={{ title: "首頁", headerTitleAlign: "center" }}
        component={Home}
      />
      <Tab.Screen
        name="addFriend"
        options={{ title: "加好友", headerTitleAlign: "center" }}
        component={AddFriend}
      />

      <Tab.Screen
        name="userInfoPersonal"
        options={({ route }) => ({
          title: "個人資料",
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
  const isNewUser = useSelector((state: RootState) => state.user.isNewUser);
  // 是否已經登入
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
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
      <Stack.Screen name="FriendList" component={FriendList} />
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

      {/* 貼文內容*/}
      <Stack.Screen name="postContent" component={PostContent} />

      {/* 搜尋頁面 */}
      <Stack.Screen name="search" component={Search} />
      {/* 新增文章 */}
      <Stack.Screen name="addPost" component={AddPost} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAuth()); // 應用程式啟動時初始化 Firebase 認證狀態
  }, [dispatch]);

  // 應用程式初始化
  const initialized = useSelector((state: RootState) => state.user.initialized);
  // 是否已經登入
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  if (!initialized) {
    return <LoadingOverlay message="loading ..." />; // 顯示載入頁面直到初始化完成
  }

  return (
    <NavigationContainer>
      {/* <AuthenticatedStack /> */}
      {/* <></> */}
      {isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <ReduxProvider store={store}>
        <Navigation />
      </ReduxProvider>
    </>
  );
}
