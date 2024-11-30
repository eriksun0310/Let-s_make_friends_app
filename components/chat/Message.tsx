import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTimeWithDayjs } from "../../shared/funcs";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Message = ({ item }) => {
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
      <Text>{formatTimeWithDayjs(item.created_at)}</Text>
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
});
export default Message;
