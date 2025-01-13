import React from "react";
import { ImageSourcePropType, View, StyleSheet, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { User } from "../../../shared/types";

interface LikeUserProps {
  item: User;
}
const LikeUser: React.FC<LikeUserProps> = ({ item }) => {
  return (
    <View style={styles.likeItem}>
      <Avatar
        rounded
        source={item?.headShot?.imageUrl as ImageSourcePropType}
        size="medium"
      />
      <Text style={styles.likeUserName}>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  likeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  likeUserName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LikeUser;
