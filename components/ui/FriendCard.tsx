import { Search, UserRoundCheck, UserRoundPlus, X } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/style";
import { calculateAge, getZodiacSign } from "../../shared/funcs";
import { NavigationProp } from "@react-navigation/native";
import { FriendState } from "../../shared/types";
import CustomIcon from "./button/CustomIcon";
import { Text, Card, Avatar } from "@rneui/themed";
import { HeadShot } from "../../shared/types";
import { sendFriendRequest } from "../../util/searchFriends";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface FriendCardProps {
  friendState: FriendState;
  index: number;
  friend: {
    userId: string;
    name: string;
    birthDate: string;
    age: number;
    headShot: HeadShot;
  };
  navigation: NavigationProp<any>;
}
const FriendCard: React.FC<FriendCardProps> = ({
  friendState,
  index,
  friend,
  navigation,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  // 點擊 好友資訊
  const clickSearch = () => {
    navigation.navigate?.("userInfoFriend", { mode: "friend" });
  };
  //點擊 加好友
  const clickAddFriend = async (senderId: string) => {
    // // console.log("friend", friend);
    // sendFriendRequest(user.userId, senderId);

    try {
      const result = await sendFriendRequest(user.userId, senderId);
      if (result.success) {
        console.log("Friend request sent successfully!");
        // 可以添加一些UI反饋，比如彈出提示
      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  //點擊 好友確認
  const clickCheckFriend = () => {};
  return (
    <Card key={index} containerStyle={styles.card}>
      <CustomIcon
        style={styles.closeButton}
        onPress={() => console.log("close")}
      >
        <X color={Colors.icon} />
      </CustomIcon>

      <Avatar
        rounded
        size="medium"
        containerStyle={styles.avatar}
        source={friend.headShot.imageUrl}
      />

      <Card.Title>{friend.name}</Card.Title>

      <Text style={styles.info}>年齡: {calculateAge(friend.birthday)}</Text>
      <Text style={styles.info}>星座: {getZodiacSign(friend.birthday)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={clickSearch}>
          <Search color={Colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (friendState === "add") {
              clickAddFriend(friend.userId);
            } else {
              clickCheckFriend();
            }
          }}
        >
          {friendState === "add" ? (
            <UserRoundPlus color={Colors.icon} />
          ) : (
            <UserRoundCheck color={Colors.icon} />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "40%",

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
