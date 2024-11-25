import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Avatar, Icon } from "@rneui/themed";

// 留言
// TODO: 到時候要傳 哪個 user 留的言 
const Comments = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.header}>
        <Avatar
          rounded
          source={require("../../assets/people/man/man.png")}
          size="small"
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>OAOA</Text>
          <Text style={styles.timestamp}>2024/08/02 22:58</Text>
        </View>
      </View>

      <Text style={styles.content}>hi hi</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ffffff",
    margin: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    color: "#999",
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
  },
});

export default Comments;
