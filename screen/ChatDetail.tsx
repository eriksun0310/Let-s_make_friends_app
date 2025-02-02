import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ImageSourcePropType,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BackButton from "../components/ui/button/BackButton";
import { Avatar } from "react-native-elements";
import { Colors } from "../constants/style";
import {
  createNewChatRoomAndInsertMessage,
  markChatRoomMessagesAsRead,
  resetUnreadCount,
  sendMessage,
} from "../util/handleChatEvent";
import Message from "../components/chat/Message";
import {
  ChatRoom,
  ChatRoomState,
  Message as MessageType,
} from "../shared/types";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {
  selectUser,
  useAppSelector,
  useAppDispatch,
  addChatRoom,
  resetUnreadUser,
  selectCurrentChatRoomId,
  setCurrentChatRoomId,
  selectIsUserOnline,
  addMessage,
  selectChatRoomMessages,
  updateMessage,
} from "../store";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
/*
chatRoomState: 'old' | 'new'
從好友列表進來 不一定是新舊聊天室
從聊天列表進來通常會是舊的聊天室
*/

interface ChatDetailProps {
  route: {
    params: {
      chatRoom: ChatRoom;
      messages: MessageType[];
      chatRoomState: ChatRoomState;
    };
  };
  navigation: NavigationProp<any, any>;
}

// 進到聊天室
const ChatDetail: React.FC<ChatDetailProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const { chatRoom } = route.params;

  const friend = chatRoom?.friend;
  const showIsRead = friend?.settings?.markAsRead;
  const personal = useAppSelector(selectUser);

  const currentChatRoomId = useAppSelector(selectCurrentChatRoomId);
  const messages = useAppSelector((state) =>
    selectChatRoomMessages({
      state: state,
      chatRoomId: currentChatRoomId || "",
    })
  );
  // 檢查對方是否上線
  const isUserOnline = useAppSelector((state) =>
    selectIsUserOnline(state, friend.userId)
  );

  const [loading, setLoading] = useState(false);

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList<MessageType>>(null);

  // 渲染訊息
  const renderMessage = ({ item }: { item: MessageType }) => (
    <>
      <Message key={item.id} item={item} showIsRead={showIsRead} />
    </>
  );

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // 訊息的id
    const tempId = `temp_${Date.now()}`;
    // 聊天室的id
    const tempChatRoomId = currentChatRoomId || `temp_chatRoomId_${Date.now()}`;
    const tempMessage = {
      id: tempId,
      senderId: personal.userId,
      recipientId: friend.userId,
      content: inputText,
      createdAt: Date.now(),
      //isTemporary: true,
      isRead: false,
      chatRoomId: tempChatRoomId,
    };

    setInputText("");
    // 先將訊息存到redux(避免在聊天室UI呈現上慢一拍)
    dispatch(addMessage(tempMessage));

    let chatRoomId = currentChatRoomId; // redux 的
    let messageResult: MessageType | null = null; // 存到messages 裡的資料(要把tempMessage 替換成 真的存在在)

    // 新聊天室
    if (!chatRoomId) {
      // 新聊天室的處理
      const { data: newChatRoomData, success } =
        await createNewChatRoomAndInsertMessage({
          userId: personal.userId,
          friendId: friend.userId,
          message: inputText,
        });

      // 如果沒有新的聊天室資料,則代表發送訊息失敗
      if (!success || !newChatRoomData?.chatRoom) return;

      chatRoomId = newChatRoomData?.chatRoom?.id;
      messageResult = newChatRoomData.messageResult!;

      // 新增自己的聊天室的redux
      dispatch(addChatRoom(newChatRoomData.chatRoom));
      dispatch(setCurrentChatRoomId(newChatRoomData.chatRoom.id));
    } else {
      // 既有聊天室，直接發送
      const { data: result, success } = await sendMessage({
        userId: personal.userId,
        friendId: friend.userId,
        message: inputText,
        chatRoomId,
        isRead: isUserOnline,
      });

      // 如果發送訊息失敗
      if (!success) return;
      messageResult = result;
    }

    // 用真正的訊息替換掉tempMessage
    if (messageResult) {
      dispatch(
        updateMessage({
          tempId,
          tempChatRoomId,
          realMessage: messageResult,
        })
      );
    }
  };

  // 進入聊天室時標記全部訊息已讀
  useEffect(() => {
    const markAllMessagesRead = async () => {
      if (currentChatRoomId && personal.userId) {
        // 更新資料庫：將自己相關的未讀訊息標記為已讀
        await markChatRoomMessagesAsRead({
          chatRoomId: currentChatRoomId,
          userId: personal.userId,
        });
      }
    };

    markAllMessagesRead();
  }, [currentChatRoomId, personal.userId]);

  // 返回聊天列表
  const handleReturnToChatList = async () => {
    // 更新資料庫的未讀數量歸0
    const { success, errorMessage } = await resetUnreadCount({
      chatRoomId: currentChatRoomId!,
      userId: personal.userId,
    });
    if (!success) {
      console.error("更新未讀數量失敗", errorMessage);
    }

    navigation.goBack();
  };

  console.log("messages", messages);

  // 監聽當前聊天室(進入、離開)
  useFocusEffect(
    useCallback(() => {
      // 進到聊天室時標記未讀數量歸0
      dispatch(
        resetUnreadUser({
          chatRoomId: currentChatRoomId,
          resetUnreadUser1: chatRoom.user1Id === personal.userId,
          resetUnreadUser2: chatRoom.user2Id === personal.userId,
        })
      );

      //離開聊天室
      return () => {
        if (currentChatRoomId) {
          console.log("離開當前聊天室", personal.userId);
          dispatch(
            resetUnreadUser({
              chatRoomId: currentChatRoomId,
              resetUnreadUser1: chatRoom.user1Id === personal.userId,
              resetUnreadUser2: chatRoom.user2Id === personal.userId,
            })
          );

          // 清除聊天室id
          dispatch(setCurrentChatRoomId(null));
        }
      };
    }, [currentChatRoomId])
  );

  if (loading) return <LoadingOverlay message="loading ..." />;

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0} // 視需求調整
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <BackButton
                onPress={handleReturnToChatList}
                style={{ marginRight: 15 }}
              />
              <Avatar
                containerStyle={styles.avatar}
                rounded
                size="medium"
                source={friend?.headShot?.imageUrl as ImageSourcePropType}
                onPress={() => {
                  navigation.navigate("userInfoFriend", {
                    userState: "friend",
                    friend: friend,
                  });
                }}
              />
              <Text style={styles.headerTitle}>{friend?.name}</Text>
            </View>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
            <View style={styles.inputContainer}>
              <TouchableOpacity>
                <Ionicons name="add" size={24} color="gray" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="輸入訊息..."
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity onPress={handleSend}>
                <Ionicons name="send" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messageList: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  separatorText: {
    textAlign: "center",
    color: "gray",
    marginVertical: 8,
    fontStyle: "italic",
  },
});

export default ChatDetail;
