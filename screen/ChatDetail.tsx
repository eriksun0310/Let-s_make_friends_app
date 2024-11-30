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
import { getMessages, sendMessage } from "../util/handleChatEvent";
import Message from "../components/chat/Message";

const ChatDetail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { user: friend } = route.params;
  const personal = useSelector((state: RootState) => state.user.user);
  const chatRooms = useSelector((state: RootState) => state.chat.chatRooms);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const renderMessage = ({ item }) => <Message item={item} />;

  const handleSend = async () => {
    if (inputText.trim()) {
      // 本地即時新增臨時訊息
      const tempMessage = {
        id: `temp_${Date.now()}`,
        sender_id: personal.userId,
        recipient_id: friend.userId,
        content: inputText,
        created_at: new Date().toISOString(),
        text: inputText,
      };

      setMessages((prev) => [...prev, tempMessage]);

      // 傳送訊息
      const result = await sendMessage({
        userId: personal.userId,
        friendId: friend.userId,
        message: inputText,
        chatRooms: chatRooms,
        dispatch: dispatch,
      });

      // 如果傳送訊息失敗(存到db失敗), 刪除臨時訊息
      if (result.error) {
        console.log(result.error);
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      } else {
        // 如果成功(訊息存到db), 重新加載訊息
        const messageData = await getMessages(result.chatRoom.id);

        if (messageData) {
          setMessages(messageData);
        }
      }

      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     id: `${prevMessages.length + 1}`,
      //     text: inputText,
      //     sender: "me",
      //     time: "現在",
      //   },
      // ]);
      setInputText("");
    }
  };
  // 確保 FlatList 自動滾動到底部
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const fetchMessages = async () => {
    const chatRoom = chatRooms.find(
      (room) =>
        (room.user1_id === personal.userId &&
          room.user2_id === friend.userId) ||
        (room.user1_id === friend.userId && room.user2_id === personal.userId)
    );

    // 聊天室存在的話
    if (chatRoom) {
      const messagesData = await getMessages(chatRoom.id);
      setMessages(messagesData);
    }
  };

  // 加載聊天記錄(如果聊天室已存在)
  useEffect(() => {
    fetchMessages();
  }, [chatRooms, personal, friend]);
  console.log("messages 111111", messages);

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
              <Text style={styles.headerTitle}>{friend.name}</Text>
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
