import { ChevronRight } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { Colors } from "../../constants/style";
const FriendItem = ({ friend }) => {
  return (
    <View style={styles.container}>
      <View style={styles.AvatarContainer}>
        <Avatar
          rounded
          size="medium"
          source={require("../../assets/animal/ostrich.png")}
        />
        <Text style={styles.friendName}>{friend.name}</Text>
      </View>

      <TouchableOpacity style={styles.icon}>
        <ChevronRight color={Colors.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    margin: 8,
    height: 100,
    padding: 12,
  },
  AvatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  friendName: {
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 10,
  },
  icon: {
    fontSize: 24,
    color: Colors.icon,
  },
});
export default FriendItem;
