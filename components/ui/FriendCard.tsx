import { Search, UserRoundCheck, UserRoundPlus, X } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card, Text, Avatar, Icon } from "react-native-elements";
import { Colors } from "../../constants/style";

interface FriendCardProps {
  mode: "add" | "confirm";
  index: number;
  friend: {
    name: string;
    birthDate: string;
    age: number;
  };
}
const FriendCard: React.FC<FriendCardProps> = ({ mode, index, friend }) => {
  return (
    <Card key={index} containerStyle={styles.card}>
      <TouchableOpacity style={styles.closeButton}>
        <X color={Colors.icon} />
      </TouchableOpacity>

      <Avatar
        rounded
        size="medium"
        containerStyle={styles.avatar}
        source={require("../../assets/animal/ostrich.png")}
      />

      <Card.Title>{friend.name}</Card.Title>
      <Text style={styles.info}>自我介紹</Text>
      <Text style={styles.info}>生日: {friend.birthDate}</Text>
      <Text style={styles.info}>年齡: {friend.age}</Text>
      <Text style={styles.info}>興趣</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Search color={Colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          {mode === "add" ? (
            <UserRoundPlus color={Colors.icon} />
          ) : (
            <UserRoundCheck color={Colors.icon} />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "40%",
    // marginBottom: 16,
    borderRadius: 12,
    // padding: 12,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  avatar: {
    backgroundColor: "#ff4444",
    alignSelf: "center",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
});
export default FriendCard;
