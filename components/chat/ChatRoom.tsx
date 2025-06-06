import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ImageSourcePropType } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import AlertDialog from "../ui/AlertDialog";
import { deleteChatRoom, setCurrentChatRoomId } from "../../store/chatSlice";
import { deleteChatRoomDB } from "../../util/handleChatEvent";
import {
  selectFriendList,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { formatTimeWithDayjs } from "../../shared/user/userFuncs";
import { ChatRoom as ChatRoomType } from "../../shared/types";
import { NavigationProp } from "@react-navigation/native";

interface ChatRoomProps {
  chatRoom: ChatRoomType;
  navigation: NavigationProp<any, any>;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoom, navigation }) => {
  const personal = useAppSelector(selectUser);
  const friendList = useAppSelector(selectFriendList);

  const dispatch = useAppDispatch();
  // 好友資料
  const friend = chatRoom.friendId
    ? friendList.find((friend) => friend.userId === chatRoom.friendId)
    : null;

  // 警告視窗 開啟狀態
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // const resetRef = useRef<() => void | null>(null); // current 是一個函數, 它的返回值可以是 void 或 null
  const resetRef = useRef<(() => void) | null>(null); // current 是一個函數 或 null

  // 關閉右滑按鈕
  const closeSwipeAble = () => {
    if (resetRef.current) {
      resetRef.current(); // 執行 `reset`
    }
  };
  // 刪除聊天室 事件
  const handleDeleteChat = async (mode: "delete" | "cancel") => {
    setIsAlertVisible(false); // 關閉警告視窗
    closeSwipeAble();

    if (mode === "delete") {
      const { data: deletedChatRoomResult, success } = await deleteChatRoomDB({
        chatRoomId: chatRoom.id,
        userId: personal.userId,
      });

      if (success && deletedChatRoomResult.deletedChatRoomId) {
        // 成功資料庫刪除, 更新redux狀態
        dispatch(deleteChatRoom(deletedChatRoomResult));
      }
    }
  };

  // 進入1對1 聊天室
  const handleChatRoomPress = async () => {
    closeSwipeAble();
    dispatch(setCurrentChatRoomId(chatRoom.id));
    navigation.navigate("chatDetail", {
      chatRoomState: "old", // 從聊天列表進來通常會是舊的聊天室
      chatRoom: chatRoom,
    });
  };

  const getUnreadCount = (chatRoom: ChatRoomType, userId: string) => {
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
        leftBtnText="取消"
        rightBtnText="刪除"
        isVisible={isAlertVisible}
        // 刪除好友
        leftBtnOnPress={() => handleDeleteChat("cancel")} //確認刪除
        rightBtnOnPress={() => handleDeleteChat("delete")} //取消
        onBackdropPress={() => handleDeleteChat("cancel")}
      />

      <ListItem.Swipeable
        style={styles.chatItem}
        rightContent={(reset) => {
          resetRef.current = reset; // 存儲 `reset`
          return (
            <Button
              title="刪除聊天室"
              onPress={() => {
                setIsAlertVisible(true);
              }}
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ height: 78, backgroundColor: "red" }}
            />
          );
        }}
        onPress={handleChatRoomPress}
      >
        <Avatar
          containerStyle={styles.chatIcon}
          rounded
          size="medium"
          source={friend?.headShot?.imageUrl as ImageSourcePropType}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatMessageContainer}>
            <Text style={styles.chatName}>{friend?.name}</Text>
            {chatRoom?.lastMessage && (
              <Text style={styles.chatTime}>
                {formatTimeWithDayjs(chatRoom?.lastTime)}
              </Text>
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
  },
});
export default ChatRoom;
