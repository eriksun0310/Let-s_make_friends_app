import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/style";
import FriendItem from "../components/ui/FriendItem";
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/ui/button/BackButton";
import { markNewFriendsAsRead } from "../util/handleFriendsEvent";
import { User } from "../shared/types";
import {
  selectFriendList,
  selectUser,
  setNewFriendUnRead,
  useAppDispatch,
  useAppSelector,
} from "../store";
import ostrich from "../assets/animal/ostrich.png";
import SearchBar from "../components/ui/SearchBar";
interface FriendListProps {
  navigation: NavigationProp<any>;
}

// 測試假資料
const testFriendList = Array(14).fill({
  name: "海鴨",
  birthDate: "2000-03-10",
  age: 24,
  headShot: {
    imageUrl: ostrich,
  },
});

//好友列表
const FriendList: React.FC<FriendListProps> = ({ navigation }) => {
  const personal = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const friendList = useAppSelector(selectFriendList);

  // search bar 的輸入文字
  const [searchText, setSearchText] = useState("");

  const renderFriendItem = ({ item }: { item: User }) => (
    <FriendItem key={item.userId} friend={item} navigation={navigation} />
  );

  //  將未讀的新好友設為已讀
  const fetchMarkNewFriendsAsRead = async () => {
    const { success } = await markNewFriendsAsRead({
      userId: personal.userId,
    });
    if (success) {
      dispatch(setNewFriendUnRead(0));
    }
  };

  // 過濾符合條件的好友列表
  const filteredFriendList = friendList.filter((friend) =>
    friend.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    navigation.setOptions({
      title: "好友列表",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
    fetchMarkNewFriendsAsRead();
  }, [navigation]);

  return (
    <View style={styles.screen}>
      {/* 搜尋列 */}
      {friendList?.length > 0 && (
        <SearchBar
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      )}
      <View style={{ marginBottom: 8 }} />
      <FlatList
        data={filteredFriendList}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FriendList;
