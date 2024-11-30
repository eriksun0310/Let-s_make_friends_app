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
import ChatItem from "../components/chat/ChatItem";
import { useEffect } from "react";
import { getChatRooms } from "../util/handleChatEvent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setChatRooms } from "../store/chatSlice";
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
const Chat = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const chatRoomsData = useSelector((state: RootState) => state.chat.chatRooms);

  const renderChatItem = ({ item }) => (
    <ChatItem user={item} navigation={navigation} />
  );

  useEffect(() => {
    const fetchChatData = async () => {
      const rooms = await getChatRooms(user.userId);
      dispatch(setChatRooms(rooms));
    };

    fetchChatData();
  }, [user.userId]);


  console.log('chatRoomsData', chatRoomsData);
  return (
    <View style={styles.screen}>
      <FlatList
        data={chatRoomsData}
        renderItem={renderChatItem}
        keyExtractor={(item) => item?.userId}
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
export default Chat;
