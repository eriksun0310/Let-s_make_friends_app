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
import FriendInvitationItem from "../components/friendInvitation/FriendInvitationItem";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { selectUser, useAppSelector } from "../store";

interface FriendInvitationProps {
  navigation: NavigationProp<any>;
}

//交友邀請
const FriendInvitation: React.FC<FriendInvitationProps> = ({ navigation }) => {
  const personal = useAppSelector(selectUser);

  const { friendRequests, loading } = useFriendRequests(personal.userId);

  useEffect(() => {
    navigation.setOptions({
      title: "交友邀請",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  if (loading) {
    return <LoadingOverlay message="交友邀請 loading ..." />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(friendRequests).map(([requestId, friendRequest]) => {
          return (
            <FriendInvitationItem
              loading={loading}
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
