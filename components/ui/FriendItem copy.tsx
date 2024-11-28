import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";
import { User } from "../../shared/types";
import { SwipeListView } from "react-native-swipe-list-view";

interface FriendItemProps {
  friend: User;
  navigation: NavigationProp<any>;
}
const FriendItem: React.FC<FriendItemProps> = ({ friend, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("userInfoFriend", {
          userState: "friend",
          friend: friend,
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.AvatarContainer}>
          <Avatar
            rounded
            size="medium"
            source={friend.headShot.imageUrl as ImageSourcePropType}
          />
          <Text style={styles.friendName}>{friend.name}</Text>
        </View>

        <TouchableOpacity>
          <ChevronRight color={Colors.icon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
