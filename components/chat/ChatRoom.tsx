import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import AlertDialog from "../ui/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { resetUnreadUser } from "../../store/chatSlice";
import { RootState } from "../../store/store";

const ChatRoom = ({ chatRoom, navigation }) => {
  const personal = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  // 好友資料
  const friend = chatRoom.friend;

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

  // 點擊聊天室
  const handleChatRoomPress = () => {
    navigation.navigate("chatDetail", { chatRoom: chatRoom });

    //TODO: 2024/12/08 加載聊天記錄? 要不要在這裡做, 因為載入聊天室的時候訊息顯示上會慢一拍

    // 清零未讀訊息
    dispatch(
      resetUnreadUser({
        chatRoomId: chatRoom.id,
        resetUnreadUser1: chatRoom.userId1 === personal.userId,
        resetUnreadUser2: chatRoom.userId2 === personal.userId,
      })
    );
  };

  const getUnreadCount = (chatRoom, userId) => {
    if (!chatRoom) return 0;
    return chatRoom.userId1 === userId
      ? chatRoom.unreadCountUser1
      : chatRoom.unreadCountUser2;
  };

  const unreadCount = getUnreadCount(chatRoom, personal.userId);

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
        onPress={handleChatRoomPress}
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
            <Text style={styles.chatTime}>{chatRoom?.lastTime}</Text>
          </View>

          <View style={styles.chatMessageContainer}>
            <Text style={styles.chatMessage}>{chatRoom?.lastMessage}</Text>
            {unreadCount > 0 && (
              <View>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
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
    // alignItems: "center",
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
    textAlign: "center",
    backgroundColor: "#A1D6EC",
    color: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: "100%",
    // borderWidth: 1,
  },
});
export default ChatRoom;