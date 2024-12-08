import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "../constants/style";
import { Avatar } from "react-native-elements";
import ChatRoom from "../components/chat/ChatRoom";
import { useEffect } from "react";
import { getAllChatRooms } from "../util/handleChatEvent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setChatRooms } from "../store/chatSlice";
import { useUnreadCount } from "../components/hooks/useUnreadCount";
const chatData = [
  // {
  //   birthday: "1998-11-03",
  //   createdAt: "2024-11-27T02:47:07.164+00:00",
  //   email: "444@gmail.com",
  //   gender: "male",
  //   headShot: {
  //     imageType: "animal",
  //     imageUrl: "11",
  //   },
  //   introduce: "Dddd 4444",
  //   name: "444",
  //   selectedOption: {
  //     dislikedFood: ["onion"],
  //     favoriteFood: ["chocolate"],
  //     interests: ["reading"],
  //   },
  //   updatedAt: "2024-11-27T02:47:07.164+00:00",
  //   userId: "af4cf8aa-a9a2-4466-9e5f-302d7eb7091c",
  //   message: "LINE台灣團隊：感謝您的支持！",
  // },
  // {
  //   birthday: "1998-11-03",
  //   createdAt: "2024-11-27T02:47:07.164+00:00",
  //   email: "444@gmail.com",
  //   gender: "male",
  //   headShot: {
  //     imageType: "animal",
  //     imageUrl: "11",
  //   },
  //   introduce: "Dddd 4444",
  //   name: "444",
  //   selectedOption: {
  //     dislikedFood: ["onion"],
  //     favoriteFood: ["chocolate"],
  //     interests: ["reading"],
  //   },
  //   updatedAt: "2024-11-27T02:47:07.164+00:00",
  //   userId: "af4cf8aa-a9a2-4466-9e5f-302d7eb7091c",
  //   message: "LINE台灣團隊：感謝您的支持！",
  // },
  // {
  //   birthday: "1998-11-03",
  //   createdAt: "2024-11-27T02:47:07.164+00:00",
  //   email: "444@gmail.com",
  //   gender: "male",
  //   headShot: {
  //     imageType: "animal",
  //     imageUrl: "11",
  //   },
  //   introduce: "Dddd 4444",
  //   name: "444",
  //   selectedOption: {
  //     dislikedFood: ["onion"],
  //     favoriteFood: ["chocolate"],
  //     interests: ["reading"],
  //   },
  //   updatedAt: "2024-11-27T02:47:07.164+00:00",
  //   userId: "af4cf8aa-a9a2-4466-9e5f-302d7eb7091c",
  //   message: "LINE台灣團隊：感謝您的支持！",
  // },
  // {
  //   birthday: "1998-11-03",
  //   createdAt: "2024-11-27T02:47:07.164+00:00",
  //   email: "444@gmail.com",
  //   gender: "male",
  //   headShot: {
  //     imageType: "animal",
  //     imageUrl: "11",
  //   },
  //   introduce: "Dddd 4444",
  //   name: "444",
  //   selectedOption: {
  //     dislikedFood: ["onion"],
  //     favoriteFood: ["chocolate"],
  //     interests: ["reading"],
  //   },
  //   updatedAt: "2024-11-27T02:47:07.164+00:00",
  //   userId: "af4cf8aa-a9a2-4466-9e5f-302d7eb7091c",
  //   message: "LINE台灣團隊：感謝您的支持！",
  // },
  // {
  //   birthday: "1998-11-03",
  //   createdAt: "2024-11-27T02:47:07.164+00:00",
  //   email: "444@gmail.com",
  //   gender: "male",
  //   headShot: {
  //     imageType: "animal",
  //     imageUrl: "11",
  //   },
  //   introduce: "Dddd 4444",
  //   name: "444",
  //   selectedOption: {
  //     dislikedFood: ["onion"],
  //     favoriteFood: ["chocolate"],
  //     interests: ["reading"],
  //   },
  //   updatedAt: "2024-11-27T02:47:07.164+00:00",
  //   userId: "af4cf8aa-a9a2-4466-9e5f-302d7eb7091c",
  //   message: "LINE台灣團隊：感謝您的支持！",
  // },
];
// 聊天室列表
const ChatRoomList = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  // 監聽未讀數量的變化
  useUnreadCount({
    userId: user.userId,
    currentChatRoomId: null,
  });

  const chatRoomsData = useSelector((state: RootState) => state.chat.chatRooms);

  const renderChatRoom = ({ item }) => {
    return <ChatRoom chatRoom={item} navigation={navigation} />;
  };

  useEffect(() => {
    const fetchChatData = async () => {
      const rooms = await getAllChatRooms(user.userId);
      dispatch(setChatRooms(rooms));
    };

    fetchChatData();
  }, [user.userId, dispatch]);

  console.log("chatRoomsData is chatRoomList", chatRoomsData);

  return (
    <View style={styles.screen}>
      <FlatList
        data={chatRoomsData}
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
    paddingTop: 8,
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
