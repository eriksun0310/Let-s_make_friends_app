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
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BackButton from "../components/ui/button/BackButton";
import { Avatar } from "react-native-elements";
import { Colors } from "../constants/style";
import {
  createNewChatRoom,
  getMessages,
  markChatRoomMessagesAllAsRead,
  markChatRoomMessagesAsRead,
  markMessageAsRead,
  resetUnreadCount,
  sendMessage,
} from "../util/handleChatEvent";
import Message from "../components/chat/Message";
import { Message as MessageType } from "../shared/types";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {
  selectUser,
  useAppSelector,
  useAppDispatch,
  addChatRoom,
  resetUnreadUser,
  selectCurrentChatRoomId,
  setCurrentChatRoomId,
} from "../store";
import { useChatContext } from "../shared/ChatContext";
import {
  handleMessageView,
  processMessageWithSeparators,
} from "../shared/chatFuncs";

/*
chatRoomState: 'old' | 'new'
從好友列表進來 不一定是新舊聊天室
從聊天列表進來通常會是舊的聊天室
*/

// 進到聊天室
const ChatDetail = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const {
    chatRoom,
    messages: preloadedMessages,
    chatRoomState,
    hasUnreadSeparator,
    setHasUnreadSeparator,
  } = route.params;

  const friend = chatRoom?.friend;
  const personal = useAppSelector(selectUser);

  const currentChatRoomId = useAppSelector(selectCurrentChatRoomId);

  const { newMessage, readMessages } = useChatContext();
  const [messages, setMessages] = useState<MessageType[]>(
    preloadedMessages || []
  );

  // 分隔符的狀態
  const [hasViewSeparator, setHasViewSeparator] = useState(false);

  const [loading, setLoading] = useState();

  const [error, setError] = useState(null);

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  // console.log("hasViewSeparator", hasViewSeparator);

  // 渲染訊息
  const renderMessage = ({ item }) => (
    <>
      <Message
        key={item.id}
        item={item}
        onView={(messageId: string) => handleMessageView(messageId)}
      />

      {item.showSeparator && hasUnreadSeparator && (
        <Text style={styles.separatorText}>
          ------------ 以下為查看訊息 ------------
        </Text>
      )}
    </>
  );

  // 發送訊息
  const handleSend = async () => {
    if (!inputText.trim()) return;

    let chatRoomId = currentChatRoomId; // redux 的
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
      dispatch(setCurrentChatRoomId(newChatRoom.id));
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

  // const onViewableItemChanged = ({ viewableItems }) => {
  //   const separatorIndex = messages.findIndex((msg) => msg.showSeparator);
  //   const isSeparatorVisible = viewableItems.some(
  //     (item) => item.index === separatorIndex
  //   );

  //   if (isSeparatorVisible && !hasViewSeparator) {
  //     setTimeout(() => {
  //       setHasViewSeparator(true); // 標記分隔符為已查看
  //     }, 1000);
  //   }
  // };

  // 清除分隔符
  const clearSeparators = () => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        showSeparator: false,
      }))
    );
  };

  //  加載訊息
  const fetchMessagesIfNeeded = async () => {
    // console.log("preloadedMessages", preloadedMessages);
    if (preloadedMessages) return; // 如果有預加載的訊息,直接使用

    try {
      setLoading(true);
      const messageData = await getMessages({
        chatRoomId: currentChatRoomId,
        userId: personal.userId,
      });

      if (messageData.success) {
        // 處理訊息資料，加入分隔符標記
        const processedData = processMessageWithSeparators(messageData.data);

        // console.log("processedData", processedData);
        setMessages(processedData); // 設置處理後的訊息
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
    if (currentChatRoomId && chatRoomState === "old") {
      fetchMessagesIfNeeded();
    }
  }, [currentChatRoomId, preloadedMessages]);

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
      if (currentChatRoomId && personal.userId) {
        // 更新資料庫：將自己相關的未讀訊息標記為已讀
        const success = await markChatRoomMessagesAsRead({
          chatRoomId: currentChatRoomId,
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
  }, [currentChatRoomId, personal.userId]);

  // 返回聊天列表
  const handleReturnToChatList = async () => {
    //console.log("聊天  当前导航堆栈:", navigation.getState());
    //更新 本地未讀數量歸0

    dispatch(
      resetUnreadUser({
        chatRoomId: currentChatRoomId,
        resetUnreadUser1: chatRoom.user1Id === personal.userId,
        resetUnreadUser2: chatRoom.user2Id === personal.userId,
      })
    );

    // 更新資料庫的未讀數量歸0
    const result = await resetUnreadCount({
      chatRoomId: currentChatRoomId!,
      userId: personal.userId,
    });
    if (!result.success) {
      console.error("更新未讀數量失敗", result.error);
    }

    if (hasUnreadSeparator) {
      // 更新資料庫的訊息 將所有 未讀 改為 已讀
      await markChatRoomMessagesAllAsRead({
        chatRoomId: currentChatRoomId!,
        userId: personal.userId,
      });
      // 返回聊天列表時清除分隔符顯示狀態
      setHasUnreadSeparator(false);
    }

    dispatch(setCurrentChatRoomId(null));

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
              // onViewableItemsChanged={onViewableItemChanged}
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
