import React from "react";
import { View, Text, StyleSheet, ImageSourcePropType } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";
import { User } from "../../shared/types";
import { ListItem } from "@rneui/themed";

interface FriendItemProps {
  friend: User;
  navigation: NavigationProp<any>;
}
const FriendItem: React.FC<FriendItemProps> = ({ friend, navigation }) => {
  return (
    <ListItem.Swipeable
      style={styles.container}
      leftContent={(reset) => (
        <Button
          title="查看好友"
          icon={{ name: "search", color: "white" }}
          buttonStyle={{ height: 100 }}
          onPress={() => {
            navigation.navigate("userInfoFriend", {
              mode: "friend",
              friend: friend,
            });
          }}
        />
      )}
      rightContent={(reset) => (
        <Button
          title="刪除好友"
          onPress={() => reset()}
          icon={{ name: "delete", color: "white" }}
          buttonStyle={{ minHeight: 100, backgroundColor: "red" }}
        />
      )}
    >
      <View style={styles.AvatarContainer}>
        <Avatar
          rounded
          size="medium"
          source={friend.headShot.imageUrl as ImageSourcePropType}
        />
      </View>
      <ListItem.Content>
        <Text style={styles.friendName}>{friend.name}</Text>
      </ListItem.Content>
      <ListItem.Chevron color={Colors.icon} />
    </ListItem.Swipeable>
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
    marginBottom: 8,
    height: 100,
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
