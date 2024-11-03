import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { UserState } from "../../shared/types";
import { NavigationProp } from "@react-navigation/native";
import CustomMenu from "../ui/CustomMenu";
import { Card, Avatar, Icon } from "@rneui/themed";
interface PostProps {
  mode: UserState;
  date: string;
  user: {
    name: string;
    headShot: {
      imageUrl: any;
    };
  };
}
const Post: React.FC<PostProps> = ({ mode, user, date }) => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.header}>
        <Avatar rounded source={user.headShot?.imageUrl} size="medium" />
        <View style={styles.headerText}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.timestamp}>{date}</Text>
        </View>
        {mode === "personal" && <CustomMenu />}
      </View>

      <Text style={styles.content}>這是我的第一篇文章</Text>
      {mode !== "visitor" && (
        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            <Icon name="heart" type="material-community" color="#ff6666" />
            <Text style={styles.iconText}>2</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="comment" type="material-community" color="#66b2ff" />
            <Text style={styles.iconText}>2</Text>
          </View>
        </View>
      )}
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

export default Post;
