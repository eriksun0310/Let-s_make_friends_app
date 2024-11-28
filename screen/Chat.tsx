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

const Chat = ({ navigation }) => {
  const chatData = [
    {
      id: "1",
      name: "momo購物網",
      message: "限時優惠！全館商品滿3000送300",
      headShot: {
        imageUrl: require("../assets/people/man/man.png"),
      },
    },
    {
      id: "2",
      name: "LINE台灣官方帳",
      message: "LINE台灣官方帳號：歡迎加入LINE...",
      headShot: {
        imageUrl: require("../assets/people/man/man.png"),
      },
    },
    {
      id: "3",
      name: "LINE台灣團隊",
      message: "LINE台灣團隊：感謝您的支持！",
      headShot: {
        imageUrl: require("../assets/people/man/man.png"),
      },
    },
    {
      id: "4",
      name: "媽咪Love",
      message: "媽咪Love：新品上市囉！",
      headShot: {
        imageUrl: require("../assets/people/man/man.png"),
      },
    },
    {
      id: "5",
      name: "LINE TODAY",
      message: "LINE TODAY：今日熱門新聞",
      headShot: {
        imageUrl: require("../assets/people/man/man.png"),
      },
    },
  ];

  const renderChatItem = ({ item }) => {
    console.log("item", item);
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          navigation.navigate("chatDetail", { item: item });
        }}
      >
        {/* <Image
          source={{ uri: item?.headShot?.imageUrl }}
          style={styles.chatIcon}
        /> */}

        <Avatar
          style={styles.chatIcon}
          rounded
          size="medium"
          source={item?.headShot?.imageUrl as ImageSourcePropType}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatMessage}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
