import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const ChatDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const [messages, setMessages] = useState([
    { id: "1", text: "能來公司一趟嗎", sender: "them", time: "上午 10:15" },
    { id: "2", text: "支援一下現場", sender: "them", time: "上午 10:16" },
    { id: "3", text: "沒問題", sender: "me", time: "上午 10:17" },
    {
      id: "4",
      text: "但留今天星期六出門人很多晚點到",
      sender: "me",
      time: "上午 10:17",
    },
    { id: "5", text: "OK 多久能到？", sender: "them", time: "上午 10:18" },
    { id: "6", text: "星期一", sender: "me", time: "上午 10:19" },
  ]);
  const [inputText, setInputText] = useState("");

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "me" ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Image source={{ uri: item.icon }} style={styles.avatar} />
          <Text style={styles.headerTitle}>{item.name}</Text>
          {/* <TouchableOpacity>
            <Ionicons name="call" size={24} color="black" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
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
          />
          {/* <TouchableOpacity>
            <Ionicons name="happy" size={24} color="gray" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <Ionicons name="mic" size={24} color="gray" />
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
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
    backgroundColor: "#DCF8C6",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-end",
    marginTop: 5,
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
});
export default ChatDetail;