import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
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
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = (event: any) => {
    setMenuVisible(true);
  };

  return (
    <TouchableOpacity onPress={() => {}}>
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
              anchor={
                <TouchableOpacity onPress={showMenu} style={styles.menuButton}>
                  <EllipsisVertical color={Colors.icon} />
                </TouchableOpacity>
              }
              contentStyle={[styles.menuContent, { marginTop: -56 }]} // 調整選單位置
            >
              <Menu.Item
                onPress={() => {}}
                title="編輯"
                style={{
                  marginHorizontal: 10,

                  height: 30,
                }}
              />
              <Menu.Item
                onPress={() => {}}
                title="刪除"
                style={{
                  marginHorizontal: 10,
                }}
                titleStyle={{ color: "#ff0000" }}
              />
            </Menu>
          )}
        </View>
        <Text style={styles.articleContent}>這是我的第一篇文章</Text>
      </View>
    </TouchableOpacity>
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
  menuButton: {
    padding: 8,
  },
  menuContent: {
    backgroundColor: "#fff",
    elevation: 8,
    width: 90,
    height: 85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Post;
