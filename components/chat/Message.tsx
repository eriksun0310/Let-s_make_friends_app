import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTimeWithDayjs } from "../../shared/user/userFuncs";
import { Colors } from "../../constants/style";
import { useAppSelector } from "../../store";
import { selectUser } from "../../store/userSlice";
import { Message as MessageType } from "../../shared/types";

interface MessageProps {
  item: MessageType;
  showIsRead: boolean; // 是否顯示已讀
}

const Message: React.FC<MessageProps> = ({ item, showIsRead }) => {
  const personal = useAppSelector(selectUser);

  return (
    <View
      style={[
        styles.messageContainer,
        item.senderId === personal.userId
          ? styles.messageContainerSender
          : styles.messageContainerRecipient,
      ]}
    >
      {item.senderId === personal.userId && (
        <View>
          {showIsRead && (
            <Text style={styles.senderIsRead}>{item.isRead && "已讀"}</Text>
          )}

          <Text style={styles.senderTime}>
            {formatTimeWithDayjs(item.createdAt)}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          item.senderId === personal.userId
            ? styles.senderMessage
            : styles.recipientMessage,
        ]}
      >
        <Text>{item.content}</Text>
      </View>
      {item.recipientId === personal.userId && (
        <View>
          <Text style={styles.recipientTime}>
            {formatTimeWithDayjs(item.createdAt)}
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
});

export default Message;
