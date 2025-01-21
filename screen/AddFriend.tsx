import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { BellRing, Users } from "lucide-react-native";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";
import { NavigationProp } from "@react-navigation/native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { Badge } from "react-native-paper";
import {
  getBeFriendUsers,
  getFriendRequests,
  insertRejectedFriendRequest,
  sendFriendRequest,
} from "../util/handleFriendsEvent";
import { FriendState } from "../shared/types";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useNewFriend } from "../components/hooks/useNewFriend";
import {
  deleteBeAddFriend,
  selectBeAddFriends,
  selectFriendRequests,
  selectFriendRequestUnRead,
  selectUser,
  setBeAddFriends,
  setFriendRequests,
  setFriendRequestUnRead,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { useAddFriendListeners } from "components/hooks/useAddFriendListeners";

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
  // useAddFriendListeners();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);

  // 可以成為好友的用戶資料
  const beAddFriends = useAppSelector(selectBeAddFriends);

  const friendRequests = useAppSelector(selectFriendRequests);
  const friendRequestUnRead = useAppSelector(selectFriendRequestUnRead);

  // 取得新的好友
  const { newFriend, newFriendsNumber, markAllAsNotified } = useNewFriend(
    personal.userId
  );

  //取得交友邀請
  //const { loading } = useFriendRequests();

  // 所有的用戶資料
  //const [allUsers, setAllUsers] = useState<User[]>([]);

  // 可以成為好友的用戶資料
  const fetchBeFriendUsers = async () => {
    setLoading(true);

    const { data: userData } = await getBeFriendUsers({
      currentUserId: personal.userId,
    });

    dispatch(setBeAddFriends(userData));
    setLoading(false);
  };

  // 取得其他用戶寄送的交友邀請
  const fetchFriendRequests = async () => {
    const { data } = await getFriendRequests({ userId: personal.userId });
    // console.log('getFriendRequests data', data);
    dispatch(setFriendRequests(data));
    // 更新未讀的好友邀請數量
    dispatch(
      setFriendRequestUnRead(data.filter((req) => req.isRead === false).length)
    );
  };

  //點擊 加好友、拒絕好友
  const clickAddRejectedFriend = async ({
    friendState,
    receiverId,
  }: {
    friendState: Omit<FriendState, "accepted">;
    receiverId: string;
  }) => {
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
    if (result.success) {
      // 更新redux 的 beAddFriends
      dispatch(deleteBeAddFriend(receiverId));
    }

    // 應該是不用
    //await fetchBeFriendUsers();
  };

  useEffect(() => {
    // 判斷是否顯示紅點
    const showBadge = friendRequestUnRead > 0 || newFriendsNumber > 0;

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
          }}
        >
          <View style={styles.bellRingContainer}>
            {friendRequestUnRead > 0 && (
              <Badge style={styles.badge}>{friendRequestUnRead}</Badge>
            )}
            <BellRing color={Colors.icon} size={25} />
          </View>
        </CustomIcon>
      ),
      // 動態設置底部導航的 tabBarBadge
      // tabBarB/adge: showBadge ? <Dot size="5" /> : null,
    });

    // fetchBeFriendUsers(); // 調用 API 獲取資料
  }, [
    navigation,
    friendRequestUnRead,
    newFriendsNumber,
    friendRequests,
    newFriend,
  ]);

  useEffect(() => {
    // 取得可以成為好友的用戶
    fetchBeFriendUsers();
    // 取得其他用戶寄送的交友邀請
    fetchFriendRequests();
  }, [personal.userId]);

  // console.log("beAddFriends 11111", beAddFriends);
  // console.log("friendRequests 1111", friendRequests);
  // console.log("friendRequestUnRead 1111", friendRequestUnRead);

  // 不確定要不要
  if (loading) return <LoadingOverlay message="AddFriend loading ..." />;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {beAddFriends?.map((user) => {
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
