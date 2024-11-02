import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Button,
} from "react-native";

import { Menu } from "react-native-paper";
import { EllipsisVertical } from "lucide-react-native";
import { Colors } from "../../constants/style";
import { UserInfoMode } from "../../shared/types";

interface PostProps {
  mode: UserInfoMode;
  date: string;
  user: {
    name: string;
    headShot: {
      imageUrl: any;
    };
  };
}
const Post: React.FC<PostProps> = ({ mode, date, user }) => {
  // 點擊...選單
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <View style={styles.articleContainer}>
      <View style={styles.articleHeader}>
        <View style={styles.userInfo}>
          <Image
            source={user.headShot?.imageUrl}
            style={styles.articleAvatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.articleDate}>{date}</Text>
        </View>
        {mode === "personal" && (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            // anchor={<Button onPress={() => setMenuVisible(true)}>⋮</Button>}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <EllipsisVertical color={Colors.icon} />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => {}} title="編輯" />
            <Menu.Item onPress={() => {}} title="刪除" />
          </Menu>
        )}
      </View>
      <Text style={styles.articleContent}>這是我的第一篇文章</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  articleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    marginRight: 10,
  },
  articleDate: {
    color: "#888",
  },
  articleContent: {
    marginTop: 10,
  },
});
export default Post;
