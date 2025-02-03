import { Check, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "../../constants/style";
import { calculateAge, getZodiacSign } from "../../shared/user/userFuncs";
import { NavigationProp } from "@react-navigation/native";
import { FriendState, User } from "../../shared/types";
import { Text, Card, Avatar } from "@rneui/themed";
import {
  acceptedFriendRequest,
  updateRejectedFriendRequest,
} from "../../util/handleFriendsEvent";
import {
  deleteFriendRequest,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from "../../store";

const translateBtnLoading = {
  addFriend: "add",
  friendInvitation: "accepted",
};

interface FriendCardProps {
  screen: "addFriend" | "friendInvitation";
  index: number | string;
  friend: User;
  navigation: NavigationProp<any>;
  onHandleAddFriendFunc?: ({
    friendState,
    receiverId,
  }: {
    friendState: Omit<FriendState, "accepted">;
    receiverId: string;
  }) => Promise<void>;
}
const FriendCard: React.FC<FriendCardProps> = ({
  screen,
  index,
  friend,
  navigation,
  onHandleAddFriendFunc,
}) => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const [buttonLoading, setButtonLoading] = useState({
    add: false,
    accepted: false,
    rejected: false,
  });

  // 點擊 好友資訊
  const clickSearch = () => {
    navigation.navigate?.("userInfoFriend", {
      userState: "visitor",
      friend: friend,
      screen: screen,
    });
  };

  // 這是 AddFriend.tsx 共用的函示 (friendState: add、reject)
  const handleAddFriendFunc = async ({
    friendId,
    friendState,
  }: {
    friendId: string;
    friendState: Omit<FriendState, "accepted">;
  }) => {
    setButtonLoading((prev) => ({
      ...prev,
      [friendState as FriendState]: true,
    }));

    await onHandleAddFriendFunc?.({
      friendState: friendState,
      receiverId: friendId,
    });
    setButtonLoading((prev) => ({
      ...prev,
      [friendState as FriendState]: false,
    }));
  };

  // 點擊 好友卡片上的按鈕(add、accepted、rejected)
  const clickFriendCardBtn = ({
    friendState,
    friendId,
  }: {
    friendState: FriendState;
    friendId: string;
  }) => {
    if (screen === "addFriend") {
      handleAddFriendFunc({
        friendId,
        friendState: friendState, // only add、rejected
      });
    } else if (screen === "friendInvitation") {
      handleFriendInvitationFunc({
        friendState: friendState,
        targetUserId: friendId, // only accepted、rejected
      });
    }
  };

  // 這是給 FriendInvitation.tsx 共用 (friendState: accepted、rejected)
  const handleFriendInvitationFunc = async ({
    friendState,
    targetUserId,
  }: {
    friendState: Omit<FriendState, "add">;
    targetUserId: string;
  }) => {
    setButtonLoading((prev) => ({
      ...prev,
      [friendState as FriendState]: true,
    }));

    try {
      let result;
      switch (friendState) {
        case "accepted":
          result = await acceptedFriendRequest({
            senderId: targetUserId,
            receiverId: personal.userId,
          });
          break;
        case "rejected":
          result = await updateRejectedFriendRequest({
            senderId: targetUserId,
            receiverId: personal.userId,
          });

          break;

        default:
          throw new Error("Invalid action type");
      }

      const { success, data } = result;
      if (success) {
        dispatch(deleteFriendRequest(data?.id));
      }
    } catch (error) {
      console.error(`Error while performing ${friendState} action:`, error);
    } finally {
      setButtonLoading((prev) => ({
        ...prev,
        [friendState as FriendState]: false,
      }));
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={clickSearch}>
      <Card key={index} containerStyle={styles.card}>
        <Avatar
          rounded
          size="medium"
          containerStyle={styles.avatar}
          source={friend?.headShot?.imageUrl as ImageSourcePropType}
        />

        <Card.Title>{friend.name}</Card.Title>

        <Text style={styles.info}>年齡: {calculateAge(friend.birthday)}</Text>
        <Text style={styles.info}>星座: {getZodiacSign(friend.birthday)}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={buttonLoading["rejected"]}
            style={styles.actionButton}
            onPress={async () => {
              clickFriendCardBtn({
                friendState: "rejected",
                friendId: friend.userId,
              });
            }}
          >
            {buttonLoading["rejected"] ? (
              <ActivityIndicator size="small" color={Colors.icon} />
            ) : (
              <X color={Colors.icon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={buttonLoading[translateBtnLoading[screen] as FriendState]}
            style={styles.actionButton}
            onPress={async () => {
              clickFriendCardBtn({
                friendState: screen === "addFriend" ? "add" : "accepted",
                friendId: friend.userId,
              });
            }}
          >
            {buttonLoading[translateBtnLoading[screen] as FriendState] ? (
              <ActivityIndicator size="small" color={Colors.icon} /> // 加載動畫
            ) : screen === "addFriend" ? (
              <Plus color={Colors.icon} />
            ) : (
              <Check color={Colors.icon} />
            )}
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
  },
  card: {
    borderRadius: 12,
  },
  avatar: {
    backgroundColor: "#ff4444",
    alignSelf: "center",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    width: "50%",
  },
});
export default FriendCard;
