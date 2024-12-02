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

  const [tempId, setTempId] = useState("");
  const { newMessage } = useNewMessages({
    chatRoomId: chatItem?.id,
    tempId: tempId,
  });

  const friend = chatItem?.friend;

  const personal = useSelector((state: RootState) => state.user.user);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const renderMessage = ({ item }) => <Message key={item.id} item={item} />;

  // 發送訊息
  // const handleSend = async () => {
  //   if (inputText.trim()) {
  //     let chatRoomId = chatItem.id;
  //     // 聊天室不存在的話, 創建一個新的聊天室
  //     if (!chatRoomId) {
  //       // 創建聊天室
  //       const newChatRoom = await createNewChatRoom(
  //         personal.userId,
  //         friend.userId
  //       );

  //       if (newChatRoom.error) {
  //         //console.log(newChatRoom.error);
  //         return;
  //       }

  //       chatRoomId = newChatRoom.id; // 創建新的聊天室的id
  //       dispatch(addChatRoom(newChatRoom)); // 更新到redux
  //     }

  //     setTempId(`temp_${Date.now()}`);
  //     let tempId = `temp_${Date.now()}`;
  //     // 本地即時新增臨時訊息
  //     const tempMessage = {
  //       id: `temp_${Date.now()}`,
  //       sender_id: personal.userId,
  //       recipient_id: friend.userId,
  //       content: inputText,
  //       created_at: new Date().toISOString(),
  //       text: inputText,
  //       isTemporary: true, // 標記為臨時訊息
  //     };

  //     setMessages((prevMessages) => [...prevMessages, tempMessage]);
  //     setInputText(""); // 清空輸入框

  //     // 傳送訊息至後端
  //     const result = await sendMessage({
  //       userId: personal.userId,
  //       friendId: friend.userId,
  //       message: inputText,
  //       chatRoomId,
  //       tempId,
  //     });

  //     // console.log("result sendMessage", result);
  //     //如果傳送訊息失敗(存到db失敗), 將臨時訊息標記為失敗
  //     if (result.error) {
  //       console.error("Failed to send message:", result.error);
  //       setMessages((prevMessages) =>
  //         prevMessages.map((msg) =>
  //           msg.id === tempId
  //             ? { ...msg, isTemporary: false, failed: true }
  //             : msg
  //         )
  //       );
  //     } else {
  //       // 更新本地訊息，將臨時id替換為後端返回的正式id
  //       setMessages((prevMessages) =>
  //         prevMessages.map((msg) => {
  //           console.log("msg", msg);
  //           return msg.id === tempId
  //             ? { ...result.data, isTemporary: false }
  //             : msg;
  //         })
  //       );
  //     }
  //   }
  // };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    let chatRoomId = chatItem.id;
    if (!chatRoomId) {
      // 嘗試創建新聊天室
      const newChatRoom = await createNewChatRoom(
        personal.userId,
        friend.userId
      );

      if (newChatRoom.error) {
        console.log(newChatRoom.error);
        return;
      }

      chatRoomId = newChatRoom.id;
      dispatch(addChatRoom(newChatRoom)); // 更新到redux
    }

    // 本地即時新增臨時訊息
    const tempMessage = {
      id: `temp_${Date.now()}`, // 使用暫時ID
      sender_id: personal.userId,
      recipient_id: friend.userId,
      content: inputText,
      created_at: new Date().toISOString(),
      isTemporary: true, // 臨時狀態標記
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setInputText(""); // 清空輸入框

    // 傳送訊息至後端
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

  // const fetchMessages = async () => {
  //   const messagesData = await getMessages(chatItem.id);
  //   if (messagesData.success) {
  //     setMessages((prevMessages) => {
  //       const updatedMessages = messagesData.data.map((message) => {
  //         const existingMessage = prevMessages.find((m) => m.id === message.id);
  //         return {
  //           ...message,
  //           isTemporary: existingMessage?.isTemporary || false, // 保留臨時狀態
  //           failed: existingMessage?.failed || false,
  //         };
  //       });
  //       return updatedMessages;
  //     });
  //   }
  // };

  const fetchMessages = async () => {
    const messagesData = await getMessages(chatItem.id);

    if (messagesData.success) {
      setMessages(messagesData.data);
    }
  };

  // 加載聊天記錄(如果聊天室已存在)
  useEffect(() => {
    if (chatItem.id) {
      fetchMessages();
    }
  }, [chatItem]);

  // 加載聊天記錄(如果聊天室已存在)
  useEffect(() => {
    if (chatItem.id) {
      fetchMessages();
    }
  }, [chatItem]);

  // 進入聊天室時標記訊息已讀
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (chatItem.id) {
        await markChatRoomMessagesAsRead({
          chatRoomId: chatItem.id,
          userId: personal.userId,
        });
      }
    };

    markMessagesAsRead();
  }, [chatItem, personal.userId]);

  // 監聽新訊息
  // useEffect(() => {
  //   const handleNewMessage = async (message) => {
  //     if (message.recipient_id === personal.userId) {
  //       const success = await markMessageAsRead(message.id);
  //       if (success) {
  //         message.is_read = true;
  //       }
  //     }

  //     setMessages((prevMessages) => {
  //       console.log("prevMessages 111111", prevMessages);
  //       console.log("messagen2222322", message);
  //       const existMessage = prevMessages.find(
  //         (m) => m.id === message.tempId || m.id === message.id
  //       );
  //       console.log("existMessage", existMessage);
  //       if (existMessage) {
  //         return prevMessages.map((msg) =>
  //           msg.id === (message.tempId || message.id)
  //             ? { ...msg, ...message, isTemporary: false } // 更新已有訊息
  //             : msg
  //         );
  //       } else {
  //         return [...prevMessages, message];
  //       }
  //     });
  //   };

  //   if (newMessage) {
  //     console.log('newMessage',)
  //     handleNewMessage(newMessage);
  //   }
  // }, [newMessage, personal.userId]);

  // 監聽新訊息
  // useEffect(() => {
  //   const markNewMessageRead = async (message) => {
  //     if (message.recipient_id === personal.userId) {
  //       const success = await markMessageAsRead(message.id); // 單條更新已讀

  //       console.log('success', success);
  //       if (success) {
  //         // 更新本地訊息的狀態
  //         setMessages((prevMessages) =>
  //           prevMessages.map((msg) =>
  //            {
  //             console.log("msg", msg);
  //             console.log("message", message);
  //             return  msg.id === message.id ? { ...msg, is_read: true } : msg
  //            }
  //           )
  //         );
  //       }
  //     }
  //   };

  //   if (newMessage) {
  //     console.log('newMessage', newMessage);
  //     markNewMessageRead(newMessage);

  //     // 更新本地訊息,避免漏掉新訊息
  //     //setMessages((preMessage) => [...preMessage, newMessage]);
  //   }
  // }, [newMessage, personal.userId]);

  // 監聽新訊息
  // useEffect(() => {
  //   const markNewMessageRead = async (message) => {
  //     if (message.recipient_id === personal.userId) {
  //       const success = await markMessageAsRead(message.id); // 單條更新已讀
  //       if (success) {
  //         // 更新本地訊息的狀態
  //         setMessages((prevMessages) =>
  //           prevMessages.map((msg) => {
  //             console.log("msg", msg);
  //             console.log("message", message);
  //             return msg.id === message.id ? { ...msg, is_read: true } : msg;
  //           })
  //         );
  //       }
  //     }
  //   };

  //   if (newMessage) {
  //     markNewMessageRead(newMessage);

  //     // 更新訊息列表，避免漏掉新訊息
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   }
  // }, [newMessage, personal.userId]);

  // useEffect(() => {
  //   const handleNewMessage = async (message) => {
  //     let updatedMessage = { ...message };

  //     //  // 如果是收件人，嘗試標記已讀
  //     if (message.recipient_id === personal.userId) {
  //       const success = await markMessageAsRead(message.id);
  //       if (success) {
  //         updatedMessage.is_read = true; // 更新已讀狀態
  //       }
  //     }

  //     setMessages((prevMessages) => {
  //       // 檢查是否已有該訊息（根據 ID）
  //       const existMessage = prevMessages.find((msg) => msg.id === message.id);

  //       if (existMessage) {
  //         // 如果訊息已存在,更新訊息
  //         return prevMessages.map((msg) => {
  //           console.log("msg", msg);
  //           console.log("message", message);
  //           return msg.id === message.id ? { ...msg, ...updatedMessage } : msg;
  //         });
  //       } else {
  //         // 如果是新訊息，則加入新的訊息
  //         return [...prevMessages, updatedMessage];
  //       }
  //     });
  //   };

  //   if (newMessage) {
  //     handleNewMessage(newMessage);
  //   }
  // }, [newMessage, personal.userId]);

  // useEffect(() => {
  //   const handleNewMessage = async (message) => {
  //     let updatedMessage = { ...message };

  //     // 如果是收件人，嘗試標記已讀
  //     if (message.recipient_id === personal.userId) {
  //       const success = await markMessageAsRead(message.id); // 單條更新已讀
  //       if (success) {
  //         updatedMessage.is_read = true; // 更新已讀狀態
  //         console.log('updatedMessage', updatedMessage)
  //         setMessages((prevMessages) => [...prevMessages, updatedMessage]);

  //       }
  //     }

  //     // console.log('messages', messages)
  //     // setMessages((prevMessages) => {
  //     //   console.log('prevMessages', prevMessages)
  //     //   // 檢查是否已有該訊息（根據 ID）
  //     //   const existMessage = prevMessages.find((msg) => {
  //     //     console.log('msg', msg)
  //     //     console.log('message', message)
  //     //     return msg.id === message.id
  //     //   });

  //     //   if (existMessage) {
  //     //     // 如果訊息已存在，更新訊息
  //     //     return prevMessages.map((msg) =>
  //     //       msg.id === message.id ? { ...msg, ...updatedMessage } : msg
  //     //     );
  //     //   } else {
  //     //     // 如果是新訊息，則加入新的訊息
  //     //     return [...prevMessages, updatedMessage];
  //     //   }
  //     // });
  //   };

  //   if (newMessage) {
  //     handleNewMessage(newMessage);
  //   }
  // }, [newMessage, personal.userId]);

  // useEffect(() => {
  //   const handleNewMessage = async (message) => {
  //     let updatedMessage = { ...message };

  //     // 如果是收件人，嘗試標記已讀
  //     if (message.recipient_id === personal.userId) {
  //       const success = await markMessageAsRead(message.id); // 單條更新已讀
  //       if (success) {
  //         updatedMessage.is_read = true; // 更新已讀狀態
  //         console.log("updatedMessage", updatedMessage);
  //         setMessages((prevMessages) => [...prevMessages, updatedMessage]);
  //       const success = await markMessageAsRead(message.id);

  //       // If marking the message as read was successful
  //       }
  //     }
  //         // Update the local message copy to reflect that it is read
  //         updatedMessage.is_read = true;

  //         // Log the updated message to the console for debugging
  //   };

  //         // Update the state to include the new or updated message
  //   if (newMessage) {
  //     handleNewMessage(newMessage);
  //   }
  // }, [newMessage, personal.userId]);

  useEffect(() => {
    const handleNewMessage = async (message) => {
      let updatedMessage = { ...message };

      // 如果是收件人，嘗試標記已讀
      if (message.recipient_id === personal.userId) {
        const success = await markMessageAsRead(message.id); // 單條更新已讀
        if (success) {
          updatedMessage.is_read = true; // 更新已讀狀態
        }
      }

      // 更新訊息列表
      setMessages((prevMessages) => {
        console.log('prevMessages',prevMessages)
        const existMessage = prevMessages.find(
          (msg) => msg.id === updatedMessage.id
        );

        if (existMessage) {
          // 如果訊息已存在，更新其內容
          return prevMessages.map((msg) =>
            msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
          );
        } else {
          // 如果訊息不存在，新增該訊息
          return [...prevMessages, updatedMessage];
        }
      });
    };

    if (newMessage) {
      console.log('newMessage', newMessage)
      handleNewMessage(newMessage);
    }
  }, [newMessage, personal.userId]);

  // 確保 FlatList 自動滾動到底部
  useEffect(() => {
    // console.log("messages", messages);
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // console.log("tempId", tempId);

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
