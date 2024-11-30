import React from "react";
import { View, Text, StyleSheet } from "react-native";

// TODO: 以後可以刪除
const Message = ({ user }) => {
  return (
    <View
      style={{
        // borderBottomWidth: 1,
        display: "flex",
        flexDirection: user.sender === "me" ? "row-reverse" : "row",
        alignItems: "center",
      }}
    >
      <View
        style={[
          styles.messageBubble,
          user.sender === "me" ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{user.text}</Text>
      </View>
      <View
        style={{
          // marginHorizontal: 10,
          marginRight: user.sender === "me" ? 5 : 0,
          marginLeft: user.sender !== "me" ? 5 : 0,
        }}
      >
        <Text style={styles.messageTime}>{user.time}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
    paddingHorizontal: 15,
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
});
export default Message;
