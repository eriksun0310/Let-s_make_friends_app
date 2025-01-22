import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect } from "react";
import { Colors } from "../constants/style";
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/ui/button/BackButton";
import FriendInvitationItem from "../components/friendInvitation/FriendInvitationItem";
import {
  selectFriendRequests,
  selectUser,
  setFriendRequestUnRead,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { markInvitationsAsRead } from "util/handleFriendsEvent";

interface FriendInvitationProps {
  navigation: NavigationProp<any>;
}

//交友邀請
const FriendInvitation: React.FC<FriendInvitationProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);

 
  const friendRequests = useAppSelector(selectFriendRequests);

  // 將未讀的邀請設為已讀
  const fetchMarkInvitationsAsRead = async () => {
    const { success } = await markInvitationsAsRead({
      userId: personal.userId,
    });
    if (success) {
      dispatch(setFriendRequestUnRead(0));
    }
  };

  // 點開交友邀請後,將未讀的邀請設為已讀
  useEffect(() => {
    navigation.setOptions({
      title: "交友邀請",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
    fetchMarkInvitationsAsRead();
  }, [navigation, personal.userId]);


  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(friendRequests).map(([requestId, friendRequest]) => {
          return (
            <FriendInvitationItem
              // loading={loading}
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
