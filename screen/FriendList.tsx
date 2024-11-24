import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/style";
import FriendItem from "../components/ui/FriendItem";
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/ui/button/BackButton";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getFriendList } from "../util/searchFriends";

interface FriendListProps {
  navigation: NavigationProp<any>;
}
//好友列表
const FriendList: React.FC<FriendListProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: "好友列表",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton navigation={navigation} />,
    });

    const fetchFriendList = async () => {
      // 取得好友列表
      try {
        const data = await getFriendList(user.userId);
        console.log("data", data);
        setFriendList(data);
      } catch (error) {
        console.log("取得好友列表 錯誤", error);
      }
    };

    fetchFriendList();
  }, [navigation, user]);

  console.log("friendList", friendList);

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
