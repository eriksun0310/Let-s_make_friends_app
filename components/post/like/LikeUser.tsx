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

  // 點擊 LikeUser 進入使用者頁面
  const handleClickLikeUser = () => {
    if (item.userState !== "personal") {
      navigation.navigate("userInfoFriend", {
        isShowMsgIcon: true,
        userState: item.userState,
        friend: item,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClickLikeUser}
      disabled={item.userState === "personal"}
    >
      <View style={styles.likeItem}>
        <Avatar
          rounded
          source={item?.headShot?.imageUrl as ImageSourcePropType}
          size="medium"
        />
        <Text style={styles.likeUserName}>{item.name}</Text>

        {/* 訪客的話,顯示加好友 */}
        {item?.userState === "visitor" && (
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
