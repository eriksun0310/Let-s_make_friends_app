import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/style";
import ChatRoom from "../components/chat/ChatRoom";
import { useEffect, useState } from "react";
import { getAllChatRooms } from "../util/handleChatEvent";
import { NavigationProp } from "@react-navigation/native";
import {
  selectUser,
  useAppDispatch,
  useAppSelector,
  selectChatRooms,
  setChatRooms,
  selectIsUserOnline,
  selectUserOnline,
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
  const isUserOnline = useAppSelector(selectUserOnline);
  //console.log("isUserOnline", isUserOnline);

  // search bar 的輸入文字
  const [searchText, setSearchText] = useState("");
  
  console.log("chatRoomsData ===>", chatRoomsData);
  // 過濾符合條件的聊天室列表
  const filteredChatRooms = chatRoomsData.filter((room) =>
    room?.friend?.name?.toLowerCase()?.includes(searchText.toLowerCase())
  );

  const renderChatRoom = ({ item }: { item: ChatRoomType }) => (
    <ChatRoom chatRoom={item} navigation={navigation} />
  );

  useEffect(() => {
    const fetchChatData = async () => {
      const { data: rooms } = await getAllChatRooms({
        userId: personal.userId,
      });

      dispatch(setChatRooms(rooms));
    };

    fetchChatData();
  }, [personal.userId, dispatch]);

  console.log("chatRoomsData", chatRoomsData);
  return (
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
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingTop: 8,
  },
});
export default ChatRoomList;
