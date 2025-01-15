import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { BellRing, Dot, Users } from "lucide-react-native";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";
import { NavigationProp } from "@react-navigation/native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { Badge } from "react-native-paper";
import {
  getBeFriendUsers,
  insertRejectedFriendRequest,
  sendFriendRequest,
} from "../util/handleFriendsEvent";
import { useFriendRequests } from "../components/hooks/useFriendRequests";
import { FriendState, User } from "../shared/types";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useNewFriend } from "../components/hooks/useNewFriend";
import { selectUser, useAppSelector } from "../store";

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
  const personal = useAppSelector(selectUser);

  // 取得新的好友
  const { newFriend, newFriendsNumber, markAllAsNotified } = useNewFriend(
    personal.userId
  );

  //取得交友邀請
  const {
    friendRequests,
    loading,
    newFriendRequestNumber,
    markInvitationsAsRead,
  } = useFriendRequests(personal.userId);

  // 所有的用戶資料
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // 可以成為好友的用戶資料
  const fetchBeFriendUsers = async () => {
    try {
      const { data: userData } = await getBeFriendUsers({
        currentUserId: personal.userId,
      });
      setAllUsers(userData);
    } catch (error) {
      console.log("取得 可以成為好友的用戶資料  錯誤", error);
    }
  };

  //點擊 加好友、拒絕好友
  const clickAddRejectedFriend = async ({
    friendState,
    receiverId,
  }: {
    friendState: Omit<FriendState, "accepted">;
    receiverId: string;
  }) => {
    try {
      let result = {} as {
        success: boolean;
      };
      if (friendState === "add") {
        result = await sendFriendRequest({
          senderId: personal.userId,
          receiverId: receiverId,
        });
      } else if (friendState === "rejected") {
        result = await insertRejectedFriendRequest({
          senderId: personal.userId,
          receiverId: receiverId,
        });
      }
      if (!result.success) {
        console.error(`Failed to add friend`);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }

    await fetchBeFriendUsers();
  };

  useEffect(() => {
    // 判斷是否顯示紅點
    const showBadge = newFriendRequestNumber > 0 || newFriendsNumber > 0;

    //  TODO: 點了好友列表後 newFriend 的length 歸0
    // 設置導航選項
    navigation.setOptions({
      headerLeft: () => (
        <CustomIcon
          onPress={async () => {
            navigation.navigate("friendList");
            await markAllAsNotified(); // 標記所有新好友為已通知
          }}
        >
          <View style={styles.bellRingContainer}>
            {newFriendsNumber > 0 && (
              <Badge style={styles.badge}>{newFriendsNumber}</Badge>
            )}
            <Users color={Colors.icon} size={25} />
          </View>
        </CustomIcon>
      ),
      headerRight: () => (
        <CustomIcon
          onPress={async () => {
            navigation.navigate("friendInvitation");
            await markInvitationsAsRead(); // 標記所有交友邀請為已讀
          }}
        >
          <View style={styles.bellRingContainer}>
            {newFriendRequestNumber > 0 && (
              <Badge style={styles.badge}>{newFriendRequestNumber}</Badge>
            )}
            <BellRing color={Colors.icon} size={25} />
          </View>
        </CustomIcon>
      ),
      // 動態設置底部導航的 tabBarBadge
      tabBarBadge: showBadge ? <Dot size="5" /> : null,
    });

    fetchBeFriendUsers(); // 調用 API 獲取資料
  }, [
    navigation,
    newFriendRequestNumber,
    newFriendsNumber,
    friendRequests,
    newFriend,
  ]);

  if (loading) return <LoadingOverlay message="AddFriend loading ..." />;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {allUsers?.map((user) => {
          return (
            <FriendCard
              screen="addFriend"
              key={user.userId}
              index={user.userId}
              friend={user}
              navigation={navigation}
              onHandleAddFriendFunc={clickAddRejectedFriend}
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
