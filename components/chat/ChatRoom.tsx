import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ImageSourcePropType } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import AlertDialog from "../ui/AlertDialog";
import {
  deleteChatRoom,
  resetUnreadUser,
  setCurrentChatRoomId,
} from "../../store/chatSlice";
import { deleteChatRoomDB, getMessages } from "../../util/handleChatEvent";
import { selectUser, useAppDispatch, useAppSelector } from "../../store";
import { processMessageWithSeparators } from "../../shared/chatFuncs";

const ChatRoom = ({ chatRoom, navigation }) => {
  const personal = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  // 好友資料
  const friend = chatRoom.friend;

  // 警告視窗 開啟狀態
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // 是否有未讀分隔符
  const [hasUnreadSeparator, setHasUnreadSeparator] = useState(false);

  const resetRef = useRef<() => void | null>(null); // 用於存儲 `reset` 函數

  // 刪除聊天室 事件
  const handleDeleteChat = async (mode: "delete" | "cancel") => {
    setIsAlertVisible(false); // 關閉警告視窗
    if (resetRef.current) {
      resetRef.current(); // 執行 `reset`
    }

    console.log("mode", mode);
    console.log("chatRoom.id", chatRoom.id);

    if (mode === "delete") {
      try {
        const result = await deleteChatRoomDB({
          roomId: chatRoom.id,
          userId: personal.userId,
        });

        if (result.success && result.roomId) {
          // 成功資料庫刪除, 更新redux狀態
          dispatch(deleteChatRoom(result.roomId));
        } else {
          console.error(
            "Failed to delete chat room:",
            result.error || "Unknown error"
          );
          alert("刪除聊天室失敗, 請再試一次");
        }
      } catch (error) {
        console.error("Unexpected error while deleting chat room:", error);
        alert("刪除聊天室失敗, 請再試一次");
      }
    }
  };

  // 進入1對1 聊天室
  const handleChatRoomPress = async () => {
    // 開始加載聊天紀錄
    const messages = await getMessages({
      chatRoomId: chatRoom.id,
      userId: personal.userId,
    });
    // 記在redux currentChatRoomId
    dispatch(setCurrentChatRoomId(chatRoom.id));

    // 判斷是否需要分隔符
    const hasSeparator = messages.data.some((message) => !message.is_read);

    setHasUnreadSeparator(hasSeparator);

    // 處理訊息資料，加入分隔符標記
    const processedData = processMessageWithSeparators(messages.data);

    navigation.navigate("chatDetail", {
      chatRoomState: "old", // 從聊天列表進來通常會是舊的聊天室
      chatRoom: chatRoom,
      messages: processedData, // 預加載的聊天記錄
      hasUnreadSeparator: hasUnreadSeparator, // 傳遞分隔符狀態
      setHasUnreadSeparator: setHasUnreadSeparator,
    });

    // 清零未讀訊息
    dispatch(
      resetUnreadUser({
        chatRoomId: chatRoom.id,
        resetUnreadUser1: chatRoom.user1Id === personal.userId,
        resetUnreadUser2: chatRoom.user2Id === personal.userId,
      })
    );
  };

  const getUnreadCount = (chatRoom, userId) => {
    if (!chatRoom) return 0;
    return chatRoom.user1Id === userId
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
            title="刪除聊天室"
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
            {chatRoom?.lastMessage && (
              <Text style={styles.chatTime}>{chatRoom?.lastTime}</Text>
            )}
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
    borderRadius: 100,
    // borderWidth: 1,
  },
});
export default ChatRoom;
