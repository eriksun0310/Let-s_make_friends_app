import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BackButton from "../components/ui/button/BackButton";
import { Avatar } from "react-native-elements";
import { Colors } from "../constants/style";
import {
  createNewChatRoom,
  getMessages,
  markChatRoomMessagesAsRead,
  markMessageAsRead,
  resetUnreadCount,
  sendMessage,
} from "../util/handleChatEvent";
import Message from "../components/chat/Message";
import {
  addChatRoom,
  resetUnreadUser,
} from "../store/chatSlice";
import { useNewMessages } from "../components/hooks/useNewMessages";
import { Message as MessageType } from "../shared/types";
import { useReadMessages } from "../components/hooks/useReadMessages";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useUnreadCount } from "../components/hooks/useUnreadCount";
import { selectUser, useAppSelector, useAppDispatch } from "../store";

// 進到聊天室
const ChatDetail = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const { chatRoom, messages: preloadedMessages } = route.params;
  const friend = chatRoom?.friend;
  const personal = useAppSelector(selectUser);

  // 監聽未讀數量的變化
  useUnreadCount({
    userId: personal.userId,
    currentChatRoomId: chatRoom.id,
  });

  // 監聽有新訊息的狀態變化
  const { newMessage } = useNewMessages({ chatRoomId: chatRoom.id });
  // 監聽有 已讀訊息的狀態變化
  const { readMessages } = useReadMessages(chatRoom.id);

  const [messages, setMessages] = useState<MessageType[]>(
    preloadedMessages || []
  );

  const [loading, setLoading] = useState(); // 如果有預加載數據，就不需要加載狀態

  const [error, setError] = useState(null);

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  // 當訊息渲染時自動標記為已讀
  const handleMessageView = async (messageId) => {
    if (messageId && messageId !== personal.userId) {
      await markMessageAsRead(messageId);
    }
  };

  const renderMessage = ({ item }) => (
    <Message
      key={item.id}
      item={item}
      onView={(messageId) => handleMessageView(messageId)}
    />
  );

  // 發送訊息
  const handleSend = async () => {
    if (!inputText.trim()) return;

    let chatRoomId = chatRoom.id;
    if (!chatRoomId) {
      const newChatRoom = await createNewChatRoom(
        personal.userId,
        friend.userId
      );
      if (newChatRoom.error) {
        console.error("Failed to create chat room:", newChatRoom.error);
        return;
      }
      chatRoomId = newChatRoom.id;
      dispatch(addChatRoom(newChatRoom));
    }

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      id: tempId,
      sender_id: personal.userId,
      recipient_id: friend.userId,
      content: inputText,
      created_at: new Date().toISOString(),
      isTemporary: true,
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setInputText("");

    const result = await sendMessage({
      userId: personal.userId,
      friendId: friend.userId,
      message: inputText,
      chatRoomId,
    });

    if (result.error) {
      console.error("Failed to send message:", result.error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, isTemporary: false, failed: true }
            : msg
        )
      );
    } else {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempMessage.id
            ? { ...result.data, isTemporary: false }
            : msg
        )
      );
    }
  };

  // const fetchMessagesIfNeeded = async () => {
  //   const messagesData = await getMessages(chatRoom.id);

  //   if (messagesData.success) {
  //     setMessages(messagesData.data);
  //   }
  // };

  const fetchMessagesIfNeeded = async () => {
    if (preloadedMessages) return; // 如果有預加載的訊息,直接使用

    try {
      setLoading(true);
      const messageData = await getMessages(chatRoom.id);

      if (messageData.success) {
        setMessages(messageData.data);
      } else {
        setError("取得訊息失敗，請稍後再試");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  // 加載聊天記錄(如果聊天室已存在且沒有預加載數據)
  useEffect(() => {
    if (chatRoom.id) {
      fetchMessagesIfNeeded();
    }
  }, [chatRoom.id, preloadedMessages]);

  // 標記單條訊息已讀
  useEffect(() => {
    if (readMessages) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          readMessages.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    }
  }, [readMessages]);

  // 監聽新訊息
  useEffect(() => {
    if (newMessage && newMessage.recipient_id === personal.userId) {
      // 更新消息列表，避免重複插入
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (msg) => msg.id === newMessage.id
        );
        return isDuplicate ? prevMessages : [...prevMessages, newMessage];
      });

      // 如果新訊息屬於當前聊天室,清零未讀數量
      // if (newMessage.chat_room_id === chatRoom.id) {
      //   dispatch(
      //     resetUnreadUser({
      //       chatRoomId: chatRoom.id,
      //       resetUnreadUser1: chatRoom.userId1 === personal.userId,
      //       resetUnreadUser2: chatRoom.userId2 === personal.userId,
      //     })
      //   );
      // }
    }
  }, [newMessage, personal.userId]);

  // 確保 FlatList 自動滾動到底部
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 進入聊天室時標記全部訊息已讀
  useEffect(() => {
    const markAllMessagesRead = async () => {
      if (chatRoom.id && personal.userId) {
        // 更新資料庫：將自己相關的未讀訊息標記為已讀
        const success = await markChatRoomMessagesAsRead({
          chatRoomId: chatRoom.id,
          userId: personal.userId,
        });

        if (success) {
          // 本地更新訊息列表：只標記屬於自己的訊息為已讀
          setMessages((prevMessages) =>
            prevMessages.map((msg) => ({
              ...msg,
              is_read:
                msg.recipient_id === personal.userId ? true : msg.is_read,
            }))
          );
        }
      }
    };

    markAllMessagesRead();
  }, [chatRoom.id, personal.userId]);

  // 返回聊天列表
  const handleReturnToChatList = async () => {
    //更新 本地未讀數量歸0
    dispatch(
      resetUnreadUser({
        chatRoomId: chatRoom.id,
        resetUnreadUser1: chatRoom.userId1 === personal.userId,
        resetUnreadUser2: chatRoom.userId2 === personal.userId,
      })
    );

    // 更新資料庫的未讀數量歸0
    const result = await resetUnreadCount({
      chatRoomId: chatRoom.id,
      userId: personal.userId,
    });
    if (!result.success) {
      console.error("更新未讀數量失敗", result.error);
    }

    console.log("返回聊天列表", chatRoom);
    navigation.goBack();
  };

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
                style={{
                  marginRight: 15,
                }}
              />
              <Avatar
                style={styles.avatar}
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
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#a6d2ff",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
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
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
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
});

export default ChatDetail;
