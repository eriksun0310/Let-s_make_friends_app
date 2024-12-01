import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTimeWithDayjs } from "../../shared/funcs";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Message = ({ item }) => {
  console.log("msg item", item);
  const personal = useSelector((state: RootState) => state.user.user);
  return (
    <View
      style={[
        styles.messageContainer,
        item.sender_id === personal.userId
          ? styles.messageContainerSender
          : styles.messageContainerRecipient,
      ]}
    >
      {item.sender_id === personal.userId && (
        <Text style={styles.senderTime}>
          {formatTimeWithDayjs(item.created_at)}
        </Text>
      )}

      <View
        style={[
          styles.messageBubble,
          item.sender_id === personal.userId
            ? styles.senderMessage
            : styles.recipientMessage,
        ]}
      >
        <Text>{item.content}</Text>
      </View>
      {item.recipient_id === personal.userId && (
        <Text style={styles.recipientTime}>
          {formatTimeWithDayjs(item.created_at)}
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  messageContainerSender: {
    justifyContent: "flex-end",
  },
  messageContainerRecipient: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#a6d2ff",
  },
  recipientMessage: {
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
  senderTime: {
    marginRight: 8,
  },
  recipientTime: {
    marginLeft: 8,
  },
});

export default Message;
