import React, { useEffect } from "react";
import { Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import { saveUserData } from "./util/auth";
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
          console.log("route", route.name);
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
  const user = useSelector((state: RootState) => state.user.user);
  const isUserExists = useSelector(
    (state: RootState) => state.user.isUserExists
  );

  const navigation = useNavigation();

  // useEffect(() => {
  //   if (isUserExists) {
  //     // 如果用戶資料存在，可以選擇跳轉
  //     navigation.navigate("main");
  //   } else {
  //     // 如果用戶資料不存在，導航到 aboutMe
  //     navigation.navigate("aboutMe");
  //   }
  // }, [isUserExists, navigation]);
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
          headerRight: () => (
            <Button
              title="儲存"
              onPress={async () => {
                // 檢查必填項目
                if (user.name) {
                  await saveUserData(user);
                  // 跳轉到地圖頁面
                  navigation.navigate("main", { screen: "chat" });
                }
              }}
            />
          ),
        }}
        component={AboutMe}
      />

      <Stack.Screen
        name="aboutMeSelectOption"
        options={({ navigation, route }) => ({
          title: "關於我興趣的選項",
          headerRight: () => (
            <Button
              title="儲存"
              onPress={() => {
                //步骤 2.点击保存按钮时，route.params?.onSave 被调用，并传递最新的 headShot。
                if (route.params?.onSave) {
                  route.params?.onSave(route.params?.selectedOption);
                }
                navigation.goBack();
              }}
            />
          ),
        })}
        component={AboutMeSelectOption}
      />

      <Stack.Screen
        name="editPersonal"
        options={{
          title: "編輯 個人資料",
          headerShown: false,
        }}
        component={EditPersonal}
      />

      <Stack.Screen
        name="editHeadShot"
        options={({ navigation, route }) => ({
          title: "編輯大頭貼",
          headerRight: () => (
            <Button
              title="儲存"
              onPress={() => {
                //步骤 2.点击保存按钮时，route.params?.onSave 被调用，并传递最新的 headShot。
                if (route.params?.onSave) {
                  route.params?.onSave(route.params?.headShot);
                }
                navigation.goBack();
              }}
            />
          ),
        })}
        component={EditHeadShot}
      />
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
      <StatusBar style="light"></StatusBar>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </>
  );
}
