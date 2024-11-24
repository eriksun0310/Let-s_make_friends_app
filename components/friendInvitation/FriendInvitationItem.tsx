import React, { useEffect, useState } from "react";
import { getFriendDetail } from "../../util/searchFriends";
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
  loading1,
  friendRequest,
  navigation,
}) => {
  const [senderData, setSenderData] = useState<User>(userInit);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSenderData = async () => {
      try {
        const data = await getFriendDetail(friendRequest.sender_id);

        setSenderData(data);
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };

    fetchSenderData();
  }, [friendRequest.sender_id]);

  return (
    Object.keys(senderData || {}).length > 0 && (
      <FriendCard
        friendState="accepted"
        key={friendRequest.sender_id}
        index={friendRequest.sender_id}
        friend={senderData}
        navigation={navigation}
      />
    )

    // sendersData?.map((sender) => {
    //   return (
    //     <FriendCard
    //       friendState="confirm"
    //       key={friendRequest.sender_id}
    //       index={friendRequest.sender_id}
    //       friend={sender}
    //       navigation={navigation}
    //     />
    //   );
    // })
  );
};

export default FriendInvitationItem;
