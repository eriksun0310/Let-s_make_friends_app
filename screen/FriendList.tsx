import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/style";
import FriendItem from "../components/ui/FriendItem";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import BackButton from "../components/ui/button/BackButton";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getFriendList } from "../util/handleFriendsEvent";
import { User } from "../shared/types";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { selectUser, useAppSelector } from "../store";
import ostrich from "../assets/animal/ostrich.png";
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
  // console.log("好友列表 render");
  const personal = useAppSelector(selectUser);

  const [friendList, setFriendList] = useState([]);

  const [loading, setLoading] = useState(false);

  // 取得好友列表
  const fetchFriendList = async () => {
    setLoading(true);
    try {
      const data = await getFriendList(personal.userId);
      setFriendList(data);
    } catch (error) {
      console.log("取得好友列表 錯誤", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFriendItem = ({ item }: { item: User }) => (
    <FriendItem
      key={item.userId}
      friend={item}
      navigation={navigation}
      onDeleteSuccess={fetchFriendList}
    />
  );

  useFocusEffect(
    useCallback(() => {
      // console.log("好友列表 useFocusEffect");
      //console.log("好友列表  当前导航堆栈:", navigation.getState());
      navigation.setOptions({
        title: "好友列表",
        headerTitleAlign: "center",
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
      });
      // 强制触发更新
      setTimeout(() => {
        navigation.setOptions({
          title: "好友列表",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        });
      }, 0);
    }, [navigation])
  );

  useEffect(() => {
    fetchFriendList();
  }, []);

  if (loading) return <LoadingOverlay message="好友列表 loading ..." />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={friendList}
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
    paddingTop: 8,
  },
  headerIcon: {
    marginHorizontal: 10,
  },
});

export default FriendList;
