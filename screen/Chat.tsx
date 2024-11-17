import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/style";

const Chat = ({ navigation }) => {
  const chatData = [
    {
      id: "1",
      name: "momo購物網",
      message: "限時優惠！全館商品滿3000送300",
      icon: "https://picsum.photos/50",
    },
    {
      id: "2",
      name: "LINE台灣官方帳",
      message: "LINE台灣官方帳號：歡迎加入LINE...",
      icon: "https://picsum.photos/51",
    },
    {
      id: "3",
      name: "LINE台灣團隊",
      message: "LINE台灣團隊：感謝您的支持！",
      icon: "https://picsum.photos/52",
    },
    {
      id: "4",
      name: "媽咪Love",
      message: "媽咪Love：新品上市囉！",
      icon: "https://picsum.photos/53",
    },
    {
      id: "5",
      name: "LINE TODAY",
      message: "LINE TODAY：今日熱門新聞",
      icon: "https://picsum.photos/54",
    },
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate("chatDetail", { item: item });
      }}
    >
      <Image source={{ uri: item.icon }} style={styles.chatIcon} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
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
