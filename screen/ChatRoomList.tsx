import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/style";
import ChatRoom from "../components/chat/ChatRoom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllChatRooms } from "../util/handleChatEvent";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import {
  selectUser,
  useAppDispatch,
  useAppSelector,
  selectChatRooms,
  setChatRooms,
  setCurrentChatRoomId,
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
  const filteredChatRooms = useMemo(() => {
    return chatRoomsData.filter((room) =>
      room?.friend?.name?.toLowerCase()?.includes(searchText.toLowerCase())
    );
  }, [chatRoomsData, searchText]);

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

  // 回到聊天列表時, 清除聊天室id
  useFocusEffect(
    useCallback(() => {
      dispatch(setCurrentChatRoomId(null));
    }, [])
  );

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
  },
});
export default ChatRoomList;
