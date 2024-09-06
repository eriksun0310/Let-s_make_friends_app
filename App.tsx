import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AvatarCreator from "./screen/AvatarCreator"; // Assuming AvatarCreator is in the same directory
import { MessageCircle, User, Map as MapIcon } from "lucide-react-native";
import Chat from "./screen/Chat";
import Map from "./screen/Map";
import Personal from "./screen/Person";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              // 
              if (route.name === "聊天") {
                return <MessageCircle color={color} size={size} />;
              } else if (route.name === "地圖") {
                return <MapIcon color={color} size={size} />;
              } else if (route.name === "個人") {
                return <User color={color} size={size} />;
              }
            },
            tabBarActiveTintColor: "#3D74DB",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="聊天" component={() => <Chat />} />
          <Tab.Screen name="地圖" component={() => <Map />} />
          <Tab.Screen name="個人" component={() => <Personal />} />
          <Tab.Screen name="大頭貼設置" component={() => <AvatarCreator />} />
        </Tab.Navigator>
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
});
