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
import { selectUser, useAppSelector } from "../../store";

type FriendActionType = "accepted" | "rejected";

interface FriendCardProps {
  friendState: FriendState;
  index: number | string;
  friend: User;
  navigation: NavigationProp<any>;
  onAddFriend?: (receiverId: string) => Promise<void>;
}
const FriendCard: React.FC<FriendCardProps> = ({
  friendState,
  index,
  friend,
  navigation,
  onAddFriend,
}) => {
  const [buttonLoading, setButtonLoading] = useState({
    add: false,
    accepted: false,
    rejected: false,
  });
  const personal = useAppSelector(selectUser);

  // 點擊 好友資訊
  const clickSearch = () => {
    navigation.navigate?.("userInfoFriend", {
      userState: "visitor",
      friend: friend,
      screen: friendState === "add" ? "addFriend" : "friendInvitation",
    });
  };

  //
  const handleFriendAction = async ({
    actionType,
    targetUserId,
  }: {
    actionType: FriendActionType;
    targetUserId: string;
  }) => {
    setButtonLoading((prev) => ({
      ...prev,
      [actionType]: true,
    }));

    try {
      let result;
      switch (actionType) {
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

      if (!result.success) {
        console.error(`Failed to ${actionType} friend`);
      }
    } catch (error) {
      console.error(`Error while performing ${actionType} action:`, error);
    } finally {
      setButtonLoading((prev) => ({
        ...prev,
        [actionType]: false,
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
          source={friend.headShot.imageUrl as ImageSourcePropType}
        />

        <Card.Title>{friend.name}</Card.Title>

        <Text style={styles.info}>年齡: {calculateAge(friend.birthday)}</Text>
        <Text style={styles.info}>星座: {getZodiacSign(friend.birthday)}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={buttonLoading["rejected"]}
            style={styles.actionButton}
            onPress={async () => {
              handleFriendAction({
                actionType: "rejected",
                targetUserId: friend.userId,
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
            disabled={buttonLoading[friendState]}
            style={styles.actionButton}
            onPress={async () => {
              if (friendState === "add") {
                setButtonLoading((prev) => ({
                  ...prev,
                  [friendState]: true,
                }));
                await onAddFriend?.(friend.userId);
                setButtonLoading((prev) => ({
                  ...prev,
                  [friendState]: false,
                }));
              } else {
                handleFriendAction({
                  actionType: "accepted",
                  targetUserId: friend.userId,
                });
              }
            }}
          >
            {buttonLoading[friendState] ? (
              <ActivityIndicator size="small" color={Colors.icon} /> // 加載動畫
            ) : friendState === "add" ? (
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
    // width: "40%",

    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    right: -8,
    top: -8,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
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
