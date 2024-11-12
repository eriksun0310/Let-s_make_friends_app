import React, { useEffect, useState } from "react";
import { getSenderFriendData } from "../../util/searchFriends";
import FriendCard from "../ui/FriendCard";
import { NavigationProp } from "@react-navigation/native";
import { FriendRequest, User } from "../../shared/types";
import { userInit } from "../../shared/static";
import LoadingOverlay from "../ui/LoadingOverlay";

interface FriendInvitationItemProps {
  friendRequest: FriendRequest;
  navigation: NavigationProp<any>;
}

const FriendInvitationItem: React.FC<FriendInvitationItemProps> = ({
  friendRequest,
  navigation,
}) => {
  const [senderData, setSenderData] = useState<User>(userInit);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSenderData = async () => {
      try {
        const data = await getSenderFriendData(friendRequest.senderId);

        setSenderData(data);
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };

    fetchSenderData();
  }, [friendRequest.senderId]);

  console.log("senderData", senderData);

  if (loading) {
    return <LoadingOverlay message="loading ..." />;
  }

  return (
    Object.keys(senderData || {}).length > 0 && (
      <FriendCard
        friendState="confirm"
        key={friendRequest.senderId}
        index={friendRequest.senderId}
        friend={senderData}
        navigation={navigation}
      />
    )
  );
};

export default FriendInvitationItem;
