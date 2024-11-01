import { ChevronLeft } from "lucide-react-native";
import { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "../constants/style";

import FriendItem from "../components/ui/FriendItem";
// 堆疊頁面

export const friendList = Array(34).fill({
  name: "海鴨",
});
//好友列表
const FriendList = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "好友列表",
      headerTitleAlign: "center",

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <ChevronLeft size={30} color={Colors.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.screen}>
      <ScrollView>
        {friendList?.map((friend, index) => (
          <FriendItem key={index} friend={friend} />
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerIcon: {
    marginHorizontal: 10,
  },
});

export default FriendList;
