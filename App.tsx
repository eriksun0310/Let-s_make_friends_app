import React, { Fragment, useState } from "react";
import { Button, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AvatarCreator from "./screen/AvatarCreator";
import { MessageCircle, User, Map as MapIcon } from "lucide-react-native";
import Chat from "./screen/Chat";
import Map from "./screen/Map";
import Personal from "./screen/Personal";
import LoginEmail from "./screen/LoginEmail";
import Register from "./screen/Register";
import LoginPassword from "./screen/LoginPassword";

// 顯示在螢幕的頁面(總是顯示所有頁面)
const Tab = createBottomTabNavigator();

// 堆疊頁面
const Stack = createStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
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

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="loginEmail"
            options={{
              title: "會員登入",
              headerShown: false,
            }}
            component={LoginEmail}
          />

          <Stack.Screen
            name="register"
            options={{
              title: "會員註冊",
              headerShown: false,
            }}
            component={Register}
          />
          <Stack.Screen
            name="loginPassword"
            options={{
              title: "會員註冊",
              headerShown: false,
            }}
            component={LoginPassword}
          />

          <Stack.Screen
            name="main"
            options={{
              title: "會員註冊",
              headerShown: false,
            }}
            component={MainTabNavigator}
          />

          <Stack.Screen
            name="avatarCreator"
            options={{
              title: "編輯大頭貼",
              headerRight: () => <Button title="儲存" onPress={() => {}} />,
            }}
            component={AvatarCreator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  chatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  chatMessage: {
    color: "gray",
  },
  saveButton: {
    backgroundColor: "#3D74DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
