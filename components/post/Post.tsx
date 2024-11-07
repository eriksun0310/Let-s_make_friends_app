import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { UserState } from "../../shared/types";
import CustomMenu from "../ui/CustomMenu";
import { Card, Avatar, Icon } from "@rneui/themed";
import { Colors } from "../../constants/style";
import AntDesign from "@expo/vector-icons/AntDesign";

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
export const tagList = Array(5).fill({
  text: "大家好",
});

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
            <Icon
              name="comment"
              type="material-community"
              color={Colors.iconBlue}
            />
            <Text style={styles.iconText}>2</Text>
          </View>
        </View>
      )}

      <View style={styles.tagContainer}>
        <AntDesign
          name="tag"
          style={{ marginRight: 5 }}
          size={24}
          color={Colors.tag}
        />
        {tagList.map((item) => (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.text}</Text>
          </View>
        ))}
      </View>
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
  tagContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 5,
    marginRight: 8,
    marginTop: 15,
  },
  tagText: {
    color: "#666",
  },
});

export default Post;
