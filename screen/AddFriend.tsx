import { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card, Text, Avatar, Icon } from "react-native-elements";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BellRing, Search, UserRoundPlus, Users, X } from "lucide-react-native";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";

export const friendCards = Array(4).fill({
  name: "海鴨",
  birthDate: "2000-01-01",
  age: 24,
});
//加好友
const AddFriend = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Users
          style={styles.headerIcon}
          color={Colors.icon}
          onPress={() => navigation.navigate("FriendList")}
        />
      ),
      headerRight: () => (
        <BellRing
          style={styles.headerIcon}
          color={Colors.icon}
          onPress={() => navigation.navigate("friendInvitation")}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {friendCards.map((friend, index) => (
          <FriendCard mode="add" key={index} index={index} friend={friend} />
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e6f3ff",
  },
  scrollContainer: {
    padding: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  headerIcon: {
    marginHorizontal: 10,
  },
});

export default AddFriend;
