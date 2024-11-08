import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/style";
import FriendItem from "../components/ui/FriendItem";
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/ui/button/BackButton";

// 堆疊頁面

export const friendList = Array(34).fill({
  name: "海鴨",
});

interface FriendListProps {
  navigation: NavigationProp<any>;
}
//好友列表
const FriendList: React.FC<FriendListProps> = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "好友列表",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton navigation={navigation} />,
    });
  }, [navigation]);
  return (
    <View style={styles.screen}>
      <ScrollView>
        {friendList?.map((friend, index) => (
          <FriendItem key={index} friend={friend} navigation={navigation} />
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
