import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTimeWithDayjs } from "../../shared/personalFuncs";
import { Colors } from "../../constants/style";
import { useAppSelector } from "../../store";
import { selectUser } from "../../store/userSlice";
import { Message as MessageType } from "../../shared/types";

interface MessageProps {
  item: MessageType;
  onView?: (messageId: string) => void;
}

const Message: React.FC<MessageProps> = ({ item, onView }) => {
  const personal = useAppSelector(selectUser);

  useEffect(() => {
    // 當組件掛載且是接收者的訊息時，觸發已讀
    if (item.recipientId === personal.userId && !item.isRead) {
      onView?.(item.id);
    }
  }, []);

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
          <Text style={styles.senderIsRead}>{item.isRead && "已讀"}</Text>
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
