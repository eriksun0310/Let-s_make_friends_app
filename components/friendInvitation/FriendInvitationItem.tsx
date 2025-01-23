import React, { useEffect, useState } from "react";
import FriendCard from "../ui/FriendCard";
import { NavigationProp } from "@react-navigation/native";
import { FriendRequest, User } from "../../shared/types";
import { userInit } from "../../shared/static";
import { getUserDetail } from "../../util/handleUserEvent";

interface FriendInvitationItemProps {
  friendRequest: FriendRequest;
  navigation: NavigationProp<any>;
}

const FriendInvitationItem: React.FC<FriendInvitationItemProps> = ({
  friendRequest,
  navigation,
}) => {
  const [senderData, setSenderData] = useState<User>(userInit);

  useEffect(() => {
    const fetchSenderData = async () => {
      const { data } = await getUserDetail({
        userId: friendRequest.senderId,
      });

      if (data) {
        setSenderData(data);
      }
    };

    fetchSenderData();
  }, [friendRequest.senderId]);

  return (
    Object.keys(senderData || {}).length > 0 && (
      <FriendCard
        screen="friendInvitation"
        key={friendRequest.senderId}
        index={friendRequest.senderId}
        friend={senderData}
        navigation={navigation}
      />
    )
  );
};

export default FriendInvitationItem;
