import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect } from "react";
import { friendCards } from "./AddFriend";
import FriendCard from "../components/ui/FriendCard";
import { Colors } from "../constants/style";
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/ui/button/BackButton";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useFriendRequests } from "../components/hooks/useFriendRequests";
import { getSenderFriendData } from "../util/searchFriends";
import FriendInvitationItem from "../components/friendInvitation/FriendInvitationItem";

interface FriendInvitationProps {
  navigation: NavigationProp<any>;
}

//交友邀請
const FriendInvitation: React.FC<FriendInvitationProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.user);

  const { friendRequests, loading } = useFriendRequests(user.userId);

  useEffect(() => {
    navigation.setOptions({
      title: "交友邀請",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton navigation={navigation} />,
    });
  }, [navigation]);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(friendRequests).map(([requestId, friendRequest]) => {
          return (
            <FriendInvitationItem
              key={requestId}
              friendRequest={friendRequest}
              navigation={navigation}
            />
          );
        })}
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
});

export default FriendInvitation;
