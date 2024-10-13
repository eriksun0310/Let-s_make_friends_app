import React, { useContext, useEffect, useState } from "react";
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
// import LoginPassword from "./screen/LoginPassword";
import AuthContextProvider, { AuthContext } from "./store/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import AboutMe from "./screen/AboutMe";
import EditPersonal from "./screen/EditPersonal";
import AboutMeSelectOption from "./screen/AboutMeSelectOption";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store/store";
import { saveUserData } from "./util/auth";

SplashScreen.preventAutoHideAsync();

// 顯示在螢幕的頁面(總是顯示所有頁面)
const Tab = createBottomTabNavigator();

// 堆疊頁面
const Stack = createStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="map"
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

// 已登入後的頁面(有驗證) AuthenticatedStack->AllStack
const AuthenticatedStack = () => {
  const user = useSelector((state:RootState) => state.user.user);
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
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
                  await saveUserData(user, authCtx.token);
                  // 跳轉到地圖頁面
                  navigation.navigate("main", { screen: "map" });
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
  const authCtx = useContext(AuthContext);


  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const Root = () => {
  //正在嘗試登錄用戶
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    const fetchToken = async () => {
      // 如果 AsyncStorage 有token 就會自動登入
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        authCtx.authenticatedToken(storedToken);
      }
      setIsTryingLogin(false);
    };
    fetchToken().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  // 正在嘗試登錄用戶
  if (isTryingLogin) {
    //確保不要看到 login 閃爍的畫面
    return null; // 可以加載一個自定義載入畫面
  }

  return <Navigation />;
};

export default function App() {
  return (
    <>
      <StatusBar style="light"></StatusBar>

      <Provider store={store}>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </Provider>
    </>
  );
}
