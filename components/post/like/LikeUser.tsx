import React from "react";
import {
  ImageSourcePropType,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import { PostLikeUser } from "../../../shared/types";
import { UserRoundMinus, UserRoundPlus } from "lucide-react-native";
import { Colors } from "../../../constants/style";

interface LikeUserProps {
  item: PostLikeUser;
}
const LikeUser: React.FC<LikeUserProps> = ({ item }) => {
  return (
    <View style={styles.likeItem}>
      <Avatar
        rounded
        source={item?.headShot?.imageUrl as ImageSourcePropType}
        size="medium"
      />
      <Text style={styles.likeUserName}>{item.name}</Text>
      {item.userState !== "personal" && (
        <TouchableOpacity>
          {item?.userState === "friend" ? (
            <UserRoundMinus color={Colors.icon} />
          ) : (
            <UserRoundPlus color={Colors.icon} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  likeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  likeUserName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LikeUser;
