import { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { BellRing, Users } from "lucide-react-native";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";

export const friendCards = Array(14).fill({
  name: "海鴨",
  birthDate: "2000-03-10",
  age: 24,
});
//加好友
const AddFriend = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("FriendList")}
          style={styles.headerIcon}
        >
          <Users color={Colors.icon} size={25} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("friendInvitation")}
          style={styles.headerIcon}
        >
          <BellRing color={Colors.icon} size={25} />
        </TouchableOpacity>
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
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  headerIcon: {
    marginHorizontal: 15,
  },
});

export default AddFriend;
