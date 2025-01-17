import { useNavigation } from "@react-navigation/native";
import { Colors } from "constants/style";
import { Check, MessageCircleMore, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { resetDeleteChatRoomState } from "shared/chat/chatFuncs";
import { FriendScreen, User, UserState } from "shared/types";
import {
  selectUser,
  setCurrentChatRoomId,
  useAppDispatch,
  useAppSelector,
} from "store";
import { getChatRoomDetail, getMessages } from "util/handleChatEvent";
import {
  acceptedFriendRequest,
  insertRejectedFriendRequest,
  sendFriendRequest,
  updateRejectedFriendRequest,
} from "util/handleFriendsEvent";

interface ActionButtonProps {
  userState: Omit<UserState, "personal">;
  screen: FriendScreen;
  friend: User;
}

// TODO: 先把UI 用好,到時候在實際串接
const ActionButton: React.FC<ActionButtonProps> = ({
  userState,
  screen,
  friend,
}) => {
  const navigation = useNavigation();
  const personal = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [buttonLoading, setButtonLoading] = useState({
    confirm: false,
    reject: false,
  });

  // 進入1對1聊天室
  const handleChatRoomPress = async () => {
    const { data: chatRoom } = await getChatRoomDetail({
      userId: personal.userId,
      friendId: friend.userId,
    });

    // 開始加載聊天紀錄
    const { data: messages } = await getMessages({
      chatRoomId: chatRoom?.id || "",
      userId: personal.userId,
    });
    dispatch(setCurrentChatRoomId(chatRoom?.id));

    navigation.navigate("chatDetail", {
      chatRoomState: chatRoom?.id ? "old" : "new", //  區分新舊聊天室
      chatRoom: {
        id: chatRoom?.id,
        friend: friend,
      },
      messages: messages,
    });

    // 重製聊天室狀態
    resetDeleteChatRoomState({
      chatRoom: chatRoom,
      userId: personal.userId,
    });
  };

  console.log("friend action btn ", friend);

  // 點擊拒絕按鈕(拒絕好友、拒絕交友邀請)
  const clickRejectedButton = async () => {
    setButtonLoading((prev) => ({
      ...prev,
      reject: true,
    }));
    // 加好友UI
    if (screen === "addFriend") {
      // 拒絕好友
      await insertRejectedFriendRequest({
        senderId: personal.userId,
        receiverId: friend.userId,
      });
      // 交友邀請UI
    } else if (screen === "friendInvitation") {
      // 拒絕交友邀請
      await updateRejectedFriendRequest({
        senderId: friend.userId,
        receiverId: personal.userId,
      });
    }

    setButtonLoading((prev) => ({
      ...prev,
      reject: false,
    }));
  };

  // 點擊確認按鈕(加好友、確認交友邀請)
  const clickConfirmButton = async () => {
    // 好友
    if (userState === "friend") {
      handleChatRoomPress();
      // 訪客
    } else {
      setButtonLoading((prev) => ({
        ...prev,
        confirm: true,
      }));

      if (screen === "addFriend") {
        // 加好友
        await sendFriendRequest({
          senderId: personal.userId,
          receiverId: friend.userId,
        });
      } else if (screen === "friendInvitation") {
        // 確認交友邀請
        await acceptedFriendRequest({
          senderId: friend.userId,
          receiverId: personal.userId,
        });
      }

      setButtonLoading((prev) => ({
        ...prev,
        confirm: false,
      }));
    }
  };

  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        disabled={buttonLoading.reject}
        style={[styles.actionButton, { marginRight: 5 }]}
        onPress={clickRejectedButton}
      >
        {buttonLoading.reject ? (
          <ActivityIndicator size="small" color={Colors.icon} />
        ) : (
          <X color={Colors.icon} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        disabled={buttonLoading.confirm && userState === "visitor"}
        style={styles.actionButton}
        onPress={clickConfirmButton}
      >
        {userState === "friend" ? (
          buttonLoading.confirm ? (
            <ActivityIndicator size="small" color={Colors.icon} />
          ) : (
            <MessageCircleMore color={Colors.icon} />
          )
        ) : screen === "addFriend" ? (
          <Plus color={Colors.icon} />
        ) : (
          <Check color={Colors.icon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    width: "20%",
    marginHorizontal: 32,
  },
});

export default ActionButton;
