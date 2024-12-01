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

const ChatItem = ({ chatItem, navigation }) => {
  // 好友資料
  const friend = chatItem.friend;

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
    }
  };


  return (
    <>
      <AlertDialog
        alertTitle={`確定要刪除與 ${friend?.name} 的聊天紀錄嗎？此操作無法恢復，是否繼續？`}
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
          // 更新已讀狀態
          navigation.navigate("chatDetail", { chatItem: chatItem });
        }}
      >
        <Avatar
          style={styles.chatIcon}
          rounded
          size="medium"
          source={friend?.headShot?.imageUrl as ImageSourcePropType}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatMessageContainer}>
            <Text style={styles.chatName}>{friend?.name}</Text>
            <Text style={styles.chatTime}>{chatItem?.last_time}</Text>
          </View>

          <View style={styles.chatMessageContainer}>
            <Text style={styles.chatMessage}>{chatItem?.last_message}</Text>
            {chatItem?.unread_count > 0 && (
              <Text style={styles.unreadCount}>{chatItem?.unread_count}</Text>
            )}
          </View>
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
    fontSize: 18,
  },
  chatMessageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    color: "#7e7e7e",
    fontSize: 16,
  },
  chatTime: {
    color: "#7e7e7e",
    fontSize: 10,
  },
  unreadCount: {
    backgroundColor: "#A1D6EC",
    color: "#ffffff",
    width: 25,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: "100%",
    // borderWidth: 1,
  },
});
export default ChatItem;
