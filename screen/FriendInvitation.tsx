import { ChevronLeft } from "lucide-react-native";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { friendCards } from "./AddFriend";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";

//交友邀請
const FriendInvitation = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "交友邀請",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <ChevronLeft size={30} color={Colors.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {friendCards.map((friend, index) => (
          <FriendCard
            mode="confirm"
            key={index}
            index={index}
            friend={friend}
          />
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
    marginHorizontal: 10,
  },
});

export default FriendInvitation;
