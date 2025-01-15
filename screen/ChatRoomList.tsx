import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/style";
import ChatRoom from "../components/chat/ChatRoom";
import { useEffect, useState } from "react";
import { getAllChatRooms } from "../util/handleChatEvent";

import { NavigationProp } from "@react-navigation/native";
import { Dot } from "lucide-react-native";
import {
  selectUser,
  useAppDispatch,
  useAppSelector,
  selectChatRooms,
  setChatRooms,
} from "../store";
import React from "react";
import SearchBar from "../components/ui/SearchBar";
import { ChatRoom as ChatRoomType } from "../shared/types";

interface ChatRoomListProps {
  navigation: NavigationProp<any>;
}

// 聊天室列表
const ChatRoomList: React.FC<ChatRoomListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);

  const chatRoomsData = useAppSelector(selectChatRooms);

  // search bar 的輸入文字
  const [searchText, setSearchText] = useState("");

  // 過濾符合條件的聊天室列表
  const filteredChatRooms = chatRoomsData.filter((room) =>
    room.friend.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderChatRoom = ({ item }: { item: ChatRoomType }) => (
    <ChatRoom chatRoom={item} navigation={navigation} />
  );

  useEffect(() => {
    const fetchChatData = async () => {
      const { data: rooms } = await getAllChatRooms({
        userId: personal.userId,
      });
      // console.log("rooms is chatRoomList", rooms);
      dispatch(setChatRooms(rooms));
    };

    fetchChatData();
  }, [personal.userId, dispatch]);

  useEffect(() => {
    // 判斷是否有未讀訊息
    const hasUnreadMessages = chatRoomsData?.some((room) => {
      const unreadCount =
        room.user1Id === personal.userId
          ? room.unreadCountUser1
          : room.unreadCountUser2;
      return unreadCount > 0;
    });

    // console.log('hasUnreadMessages', hasUnreadMessages)
    navigation.setOptions({
      // 動態設置底部導航的 tabBarBadge
      tabBarBadge: hasUnreadMessages ? <Dot size={10}></Dot> : null,
    });
  }, [navigation, chatRoomsData, personal.userId]);

  return (
    // <ChatContextProvider>
    <View style={styles.screen}>
      {/* 搜尋列 */}
      {chatRoomsData?.length > 0 && (
        <SearchBar
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      )}
      <View style={{ marginBottom: 8 }} />
      <FlatList
        data={filteredChatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item?.id}
      />
    </View>
    // </ChatContextProvider>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingTop: 8,
  },
  chatItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
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
    color: "#7e7e7e",
  },
});
export default ChatRoomList;
