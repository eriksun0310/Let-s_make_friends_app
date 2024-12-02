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
  markChatRoomMessagesAsRead,
  markMessageAsRead,
  sendMessage,
} from "../util/handleChatEvent";
import Message from "../components/chat/Message";
import { addChatRoom } from "../store/chatSlice";
import { useNewMessages } from "../components/hooks/useNewMessages";
import { Message as MessageType } from "../shared/types";

// 進到聊天室
const ChatDetail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { chatItem } = route.params;
  const friend = chatItem?.friend;
  const personal = useSelector((state: RootState) => state.user.user);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const renderMessage = ({ item }) => <Message key={item.id} item={item} />;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    let chatRoomId = chatItem.id;
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
      tempId,
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


  // 確保 FlatList 自動滾動到底部
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);


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
