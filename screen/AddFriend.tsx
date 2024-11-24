import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { BellRing, Users } from "lucide-react-native";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";
import { NavigationProp } from "@react-navigation/native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { Badge } from "react-native-paper";
import { getAllUsers, sendFriendRequest } from "../util/searchFriends";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useFriendRequests } from "../components/hooks/useFriendRequests";
import { User } from "../shared/types";
import LoadingOverlay from "../components/ui/LoadingOverlay";

export const friendCards = Array(14).fill({
  name: "海鴨",
  birthDate: "2000-03-10",
  age: 24,
});

interface AddFriendProps {
  navigation: NavigationProp<any>;
}
//加好友
const AddFriend: React.FC<AddFriendProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.user);

  const { friendRequests, loading } = useFriendRequests(user.userId);

  // 所有的用戶資料
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // 可以成為好友的用戶資料
  const fetchAllUsers = async () => {
    try {
      const userData = (await getAllUsers(user.userId)) as User[];
      setAllUsers(userData);
    } catch (error) {
      console.log("取得 可以成為好友的用戶資料  錯誤", error);
    }
  };

  //點擊 加好友
  const clickAddFriend = async (receiverId: string) => {
    try {
      const result = await sendFriendRequest({
        senderId: user.userId,
        receiverId: receiverId,
      });
      if (!result.success) {
        console.error(`Failed to add friend`);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }

    await fetchAllUsers();
  };

  useEffect(() => {

  console.log("friendRequests",friendRequests);
    // 設置導航選項
    navigation.setOptions({
      headerLeft: () => (
        <CustomIcon onPress={() => navigation.navigate("FriendList")}>
          <Users color={Colors.icon} size={25} />
        </CustomIcon>
      ),
      headerRight: () => (
        <CustomIcon onPress={() => navigation.navigate("friendInvitation")}>
          <View style={styles.bellRingContainer}>
            {Object.keys(friendRequests).length > 0 && (
              <Badge style={styles.badge}>
                {Object.keys(friendRequests).length}
              </Badge>
            )}
            <BellRing color={Colors.icon} size={25} />
          </View>
        </CustomIcon>
      ),
    });

    fetchAllUsers(); // 調用 API 獲取資料
  }, [navigation, friendRequests]);

  if (loading) return <LoadingOverlay message="AddFriend loading ..." />;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {allUsers?.map((user) => {
          return (
            <FriendCard
              friendState="add"
              key={user.userId}
              index={user.userId}
              friend={user}
              navigation={navigation}
              onAddFriend={clickAddFriend}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bellRingContainer: {
    position: "relative",
  },
  badge: {
    fontSize: 12,
    position: "absolute",
    top: -10,
    right: -8,
    zIndex: 1,
    backgroundColor: "#ff4949",
  },
});

export default AddFriend;
