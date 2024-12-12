import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/style";
import ChatRoom from "../components/chat/ChatRoom";
import { useEffect } from "react";
import { getAllChatRooms } from "../util/handleChatEvent";
import { useUnreadCount } from "../components/hooks/useUnreadCount";
import { NavigationProp } from "@react-navigation/native";
import { Dot } from "lucide-react-native";
import {
  selectUser,
  useAppDispatch,
  useAppSelector,
  selectChatRooms,
  setChatRooms,
} from "../store";
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
];

interface ChatRoomListProps {
  navigation: NavigationProp<any>;
}

// 聊天室列表
const ChatRoomList: React.FC<ChatRoomListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // const [currentChatRoomId, setCurrentChatRoomId] = useState("");

  // 監聽未讀數量的變化
  useUnreadCount({
    userId: user.userId,
    currentChatRoomId: null,
  });

  const chatRoomsData = useAppSelector(selectChatRooms);

  const renderChatRoom = ({ item }) => {
    console.log("item is chatRoomList", item);
    return <ChatRoom chatRoom={item} navigation={navigation} />;
  };

  useEffect(() => {
    const fetchChatData = async () => {
      const rooms = await getAllChatRooms(user.userId);
      console.log("rooms is chatRoomList", rooms);
      dispatch(setChatRooms(rooms));
    };

    fetchChatData();
  }, [user.userId, dispatch]);

  useEffect(() => {
    console.log("chatRoomsData is chatRoomList", chatRoomsData);

    // 判斷是否有未讀訊息
    const hasUnreadMessages = chatRoomsData?.some((room) => {
      const unreadCount =
        room.userId1 === user.userId
          ? room.unreadCountUser1
          : room.unreadCountUser2;
      return unreadCount > 0;
    });

    navigation.setOptions({
      // 動態設置底部導航的 tabBarBadge
      tabBarBadge: hasUnreadMessages ? <Dot size={10}></Dot> : null,
    });
  }, [navigation, chatRoomsData, user.userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focus");
      console.log("chatRoomsData", chatRoomsData);
      // setCurrentChatRoomId(null);
    });

    return unsubscribe;
  }, []);

  //  useEffect(()=>{
  //   console.log(1111111111111)
  //   setCurrentChatRoomId('1111');
  //  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("222222");
  //   }, [])
  // );

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
