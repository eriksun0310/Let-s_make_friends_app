import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "../../constants/style";
const PostTags = ({ tags }: { tags: string[] }) => {
  return (
    <View style={styles.tagContainer}>
      <AntDesign
        name="tag"
        style={{ marginRight: 5 }}
        size={24}
        color={Colors.tag}
      />
      {tags.map((tag) => (
        <View style={styles.tag} key={tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
export default PostTags;
