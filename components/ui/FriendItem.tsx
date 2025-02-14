import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ImageSourcePropType } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";
import { User } from "../../shared/types";
import { ListItem } from "@rneui/themed";
import AlertDialog from "./AlertDialog";
import { deleteFriendDB } from "../../util/handleFriendsEvent";
import {
  deleteFriend,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from "../../store";

interface FriendItemProps {
  friend: User;
  navigation: NavigationProp<any>;
}
const FriendItem: React.FC<FriendItemProps> = ({ friend, navigation }) => {
  const dispatch = useAppDispatch();
  // 取得個人資料
  const personal = useAppSelector(selectUser);

  // 警告視窗 開啟狀態
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const resetRef = useRef(() => {}); // 用於存儲 `reset` 函數

  // 關閉右滑按鈕
  const closeSwipeAble = () => {
    if (resetRef.current) {
      resetRef.current(); // 執行 `reset`
    }
  };

  // 刪除好友 事件
  const handleDeleteFriend = async (mode: "delete" | "cancel") => {
    setIsAlertVisible(false); // 關閉警告視窗
    closeSwipeAble();

    if (mode === "delete") {
      const { success } = await deleteFriendDB({
        userId: personal.userId,
        friendId: friend.userId,
      });

      if (success) {
        dispatch(deleteFriend(friend.userId));
      }
    }
  };

  // 好友詳細資料
  const handleUserInfoFriendPress = () => {
    closeSwipeAble();

    navigation.navigate("userInfoFriend", {
      isShowMsgIcon: true,
      userState: "friend",
      friend: friend,
    });
  };

  return (
    <>
      <AlertDialog
        alertTitle={`確認刪除 ${friend.name} 好友，聊天紀錄將永久刪除，是否繼續?`}
        leftBtnText="取消"
        rightBtnText="刪除"
        isVisible={isAlertVisible}
        // 刪除好友
        // leftBtnOnPress={() => handleDeleteFriend("delete")} //確認刪除
        // rightBtnOnPress={() => handleDeleteFriend("cancel")} //取消
        leftBtnOnPress={() => handleDeleteFriend("cancel")} //確認刪除
        rightBtnOnPress={() => handleDeleteFriend("delete")} //取消
        onBackdropPress={() => handleDeleteFriend("cancel")}
        rightButtonStyle={{
          backgroundColor: "#ffcccc",
        }}
        rightTitleStyle={{
          color: "#d9534f",
        }}
      />

      <ListItem.Swipeable
        style={styles.container}
        leftContent={null}
        rightContent={(reset) => {
          resetRef.current = reset; // 存儲 `reset`
          return (
            <Button
              title="刪除好友"
              onPress={() => {
                setIsAlertVisible(true);
              }}
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ minHeight: 100, backgroundColor: "red" }}
            />
          );
        }}
        onPress={handleUserInfoFriendPress}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            rounded
            size="medium"
            source={friend.headShot.imageUrl as ImageSourcePropType}
          />
        </View>
        <ListItem.Content>
          <Text style={styles.friendName}>{friend.name}</Text>
        </ListItem.Content>
        <ListItem.Chevron color={Colors.icon} />
      </ListItem.Swipeable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: 100,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  friendName: {
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 10,
  },
  icon: {
    fontSize: 24,
    color: Colors.icon,
  },
});
export default FriendItem;
