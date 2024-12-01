import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTimeWithDayjs } from "../../shared/funcs";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Colors } from "../../constants/style";

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
      {item.sender_id === personal.userId && (
        <View>
          <Text style={styles.senderIsRead}>{item.is_read && "已讀"}</Text>
          <Text style={styles.senderTime}>
            {formatTimeWithDayjs(item.created_at)}
          </Text>
        </View>
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
        <View>
          <Text style={styles.recipientTime}>
            {formatTimeWithDayjs(item.created_at)}
          </Text>
        </View>
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
  senderIsRead: {
    alignSelf: "flex-end",
    marginRight: 8,
  },
  recipientTime: {
    fontSize: 12,
    marginLeft: 8,
    color: Colors.msgGray,
  },
  recipientIsRead: {
    //  alignSelf: "flex-start",
    marginLeft: 10,
  },
});

export default Message;
