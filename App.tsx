import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EditHeadShot from "./screen/EditHeadShot";
import { MessageCircle, User, Map as MapIcon } from "lucide-react-native";
import Chat from "./screen/Chat";
import Map from "./screen/Map";
import Personal from "./screen/Personal";
import Login from "./screen/Login";
import Register from "./screen/Register";
import AboutMe from "./screen/AboutMe";
import EditPersonal from "./screen/EditPersonal";
import AboutMeSelectOption from "./screen/AboutMeSelectOption";
import { Provider, useSelector } from "react-redux";
import store, { RootState, useDispatch } from "./store/store";

import LoadingOverlay from "./components/ui/LoadingOverlay";
import { initializeAuth } from "./store/userSlice";

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
          } else if (route.name === "map") {
            return <MapIcon color={color} size={size} />;
          } else if (route.name === "personal") {
            return <User color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: "#3D74DB",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="chat" options={{ title: "聊天室" }} component={Chat} />
      <Tab.Screen name="map" options={{ title: "地圖" }} component={Map} />
      <Tab.Screen
        name="personal"
        options={{ title: "個人資料" }}
        component={Personal}
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
  return (
    <Stack.Navigator>
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
        }}
        component={AboutMe}
      />

      <Stack.Screen
        name="aboutMeSelectOption"
        component={AboutMeSelectOption}
      />

      <Stack.Screen name="editPersonal" component={EditPersonal} />

      <Stack.Screen name="editHeadShot" component={EditHeadShot} />
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
      {isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </>
  );
}
