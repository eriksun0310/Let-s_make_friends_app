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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  createNewChatRoom,
  getMessages,
  sendMessage,
} from "../util/handleChatEvent";
import Message from "../components/chat/Message";
import { addChatRoom } from "../store/chatSlice";
import { useNewMessages } from "../components/hooks/useNewMessages";

// 進到聊天室
const ChatDetail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { chatItem } = route.params;
  // const [chatItem, setChatItem] = useState({
  //   id: null, // 初始為空，稍後更新
  //   friend: {},
  // });
  const friend = chatItem?.friend;

  const personal = useSelector((state: RootState) => state.user.user);
  const chatRooms = useSelector((state: RootState) => state.chat.chatRooms);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const renderMessage = ({ item }) => <Message item={item} />;

  // 當有新訊息時,更新本地訊息列表
  const handleNewMessage = (newMessage) => {
    setMessages((preMessage) => [...preMessage, newMessage]);
  };

  // 使用監聽 hook
  // useNewMessages({
  //   chatRoomId: chatItem.id,
  //   handleNewMessage: handleNewMessage,
  // });

  // 發送訊息
  const handleSend = async () => {
    if (inputText.trim()) {
      let chatRoomId = chatItem.id;
      // 聊天室不存在的話, 創建一個新的聊天室
      if (!chatRoomId) {
        // 創建聊天室
        const newChatRoom = await createNewChatRoom(
          personal.userId,
          friend.userId
        );

        if (newChatRoom.error) {
          console.log(newChatRoom.error);
          return;
        }

        chatRoomId = newChatRoom.id; // 創建新的聊天室的id
        dispatch(addChatRoom(newChatRoom)); // 更新到redux
      }

      // 本地即時新增臨時訊息
      const tempMessage = {
        id: `temp_${Date.now()}`,
        sender_id: personal.userId,
        recipient_id: friend.userId,
        content: inputText,
        created_at: new Date().toISOString(),
        text: inputText,
        isTemporary: true, // 標記為臨時訊息
      };

      // setMessages((prevMessages) => [...prevMessages, tempMessage]);

      // 傳送訊息
      const result = await sendMessage({
        userId: personal.userId,
        friendId: friend.userId,
        message: inputText,
        chatRoomId,
      });

      console.log("result sendMessage", result);
      // 如果傳送訊息失敗(存到db失敗), 刪除臨時訊息
      if (result.error) {
        console.log("Failed to send message:", result.error);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, isTemporary: false } : msg
          )
        );
      } else {
        // 傳送成功，刷新訊息列表
        const messagesData = await getMessages(chatRoomId);
        console.log("messagesData 111111111", messagesData);
        if (messagesData.success) {
          setMessages(messagesData.data);
        }
      }
      setInputText("");
    }
  };
  // 確保 FlatList 自動滾動到底部
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 加載聊天記錄(如果聊天室已存在)
  useEffect(() => {
  
    const fetchMessages = async () => {
      const messagesData = await getMessages(chatItem.id);
      console.log("fetchMessages", messagesData);
      if (messagesData.success) {
        setMessages(messagesData.data);
      }
    };

    if (chatItem.id) {
      fetchMessages();
    }
  }, [chatItem]);

  // useEffect(() => {
  //   console.log("defaultChatItem 1111111", defaultChatItem);
  //   if (defaultChatItem) {
  //     console.log("defaultChatItem 222222222", defaultChatItem);
  //     setChatItem({
  //       id: defaultChatItem.id, // 初始化時處理可能的 null 值
  //       friend: defaultChatItem.friend || {},
  //     });
  //   }
  // }, [defaultChatItem]);

  console.log("messages ", messages);

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
                navigation={navigation}
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
              onLayout={() =>
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
