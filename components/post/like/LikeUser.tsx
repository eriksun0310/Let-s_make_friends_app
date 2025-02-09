import React from "react";
import {
  ImageSourcePropType,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { PostLikeUser } from "../../../shared/types";
import { Plus } from "lucide-react-native";
import { Colors } from "../../../constants/style";
import { useNavigation } from "@react-navigation/native";

interface LikeUserProps {
  item: PostLikeUser;
}
const LikeUser: React.FC<LikeUserProps> = ({ item }) => {
  const navigation = useNavigation();

  const likeUser = item?.user;
  const likeUserState = likeUser?.userState;

  // 點擊 LikeUser 進入使用者頁面
  const handleClickLikeUser = () => {
    if (likeUserState !== "personal") {
      navigation.navigate("userInfoFriend", {
        isShowMsgIcon: true,
        userState: likeUserState,
        friend: likeUser,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClickLikeUser}
      disabled={likeUserState === "personal"}
    >
      <View style={styles.likeItem}>
        <Avatar
          rounded
          source={likeUser?.headShot?.imageUrl as ImageSourcePropType}
          size="medium"
        />
        <Text style={styles.likeUserName}>{likeUser?.name}</Text>

        {/* 訪客的話,顯示加好友 */}
        {likeUserState === "visitor" && (
          <TouchableOpacity style={styles.actionButton}>
            <Plus color={Colors.icon} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    width: "50%",
  },
});

export default LikeUser;
