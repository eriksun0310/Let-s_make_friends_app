import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import AlertDialog from "../ui/AlertDialog";



const ChatItem = ({ user, navigation }) => {
  // 警告視窗 開啟狀態
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const resetRef = useRef<() => void | null>(null); // 用於存儲 `reset` 函數

  // 刪除聊天室 事件
  const handleDeleteChat = async (mode: "delete" | "cancel") => {
    setIsAlertVisible(false); // 關閉警告視窗
    if (resetRef.current) {
      resetRef.current(); // 執行 `reset`
    }

    if (mode === "delete") {
      console.log("delete");
      //   const { success } = await deleteFriend({
      //     userId: personal.userId,
      //     friendId: friend.userId,
      //   });

      //   if (success) {
      //     await onDeleteSuccess();
      //     console.log("delete success");
      //   } else {
      //     console.log("delete error");
      //   }
    }
  };

  return (
    <>
      <AlertDialog
        alertTitle={`確定要刪除與 ${user.name} 的聊天紀錄嗎？此操作無法恢復，是否繼續？`}
        leftBtnText="刪除"
        rightBtnText="取消"
        isVisible={isAlertVisible}
        // 刪除好友
        leftBtnOnPress={() => handleDeleteChat("delete")} //確認刪除
        rightBtnOnPress={() => handleDeleteChat("cancel")} //取消
        onBackdropPress={() => handleDeleteChat("cancel")}
      />

      <ListItem.Swipeable
        style={styles.chatItem}
        rightContent={(reset) => (
          <Button
            title="刪除好友"
            onPress={() => {
              resetRef.current = reset; // 存儲 `reset`
              setIsAlertVisible(true);
            }}
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ height: 78, backgroundColor: "red" }}
          />
        )}
        onPress={() => {
          navigation.navigate("chatDetail", { user: user });
        }}
      >
        <Avatar
          style={styles.chatIcon}
          rounded
          size="medium"
          source={user?.headShot?.imageUrl as ImageSourcePropType}
        //   onPress={() => console.log('click pppppp')}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{user.name}</Text>
          <Text style={styles.chatMessage}>{user.message}</Text>
        </View>
      </ListItem.Swipeable>
    </>
  );
};
const styles = StyleSheet.create({
  chatItem: {
    backgroundColor: "#fff",
    marginBottom: 7,
  },
  chatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  chatMessage: {
    color: "#7e7e7e",
  },
});
export default ChatItem;
