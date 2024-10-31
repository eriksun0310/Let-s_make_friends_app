import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/style";
import { Avatar } from "react-native-elements";
// 堆疊頁面

export const friendList = Array(34).fill({
  name: "海鴨",
});
//好友列表
const FriendList = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "好友列表",
      headerLeft: () => (
        <ChevronLeft color={Colors.icon} onPress={() => navigation.goBack()} />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.screen}>
      <ScrollView>
        {friendList?.map((friend, index) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              margin: 8,
              height: 100,
              padding: 12,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar
                rounded
                size="medium"
                source={require("../assets/animal/ostrich.png")}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  paddingLeft: 10,
                  color: "#666",
                }}
              >
                {friend.name}
              </Text>
            </View>

            <TouchableOpacity style={styles.icon}>
              <ChevronRight color={Colors.icon} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e6f3ff",
  },
  icon: {
    fontSize: 24,
    color: "#666",
  },
});

export default FriendList;
