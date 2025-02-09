import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Avatar } from "@rneui/themed";
import { Colors } from "../constants/style";
import { NavigationProp } from "@react-navigation/native";
import ostrich from "../assets/animal/ostrich.png";
import BackButton from "components/ui/button/BackButton";
import { selectPostInteractions, useAppSelector } from "store";
import { PostInteraction } from "shared/types";
import { formatTimeAgo } from "shared/post/postFuncs";
const recentSearches = [
  { id: "1", name: "1111" },
  { id: "2", name: "2222" },
];

interface SearchProps {
  navigation: NavigationProp<any>;
}

// 貼文互動通知(按讚、留言)
const PostInteractions: React.FC<SearchProps> = ({ navigation }) => {
  // search bar 的輸入文字
  const [searchText, setSearchText] = useState("");

  const postInteractions = useAppSelector(selectPostInteractions);

  const renderItem = ({ item }: { item: PostInteraction }) => {
    const user = item.user;

    return (
      <View style={styles.itemView}>
        <Avatar rounded source={user?.headShot?.imageUrl} size="medium" />
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderWidth: 1,
          }}
        >
          <Text style={styles.text}>{user?.name}</Text>
          {item.type === "like" ? (
            <Text style={styles.text1}>
              按讚了你的貼文。{formatTimeAgo(item.createdAt)}
            </Text>
          ) : (
            <Text style={styles.text1}>
              留言了你的貼文。{formatTimeAgo(item.createdAt)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  console.log("postInteractions", postInteractions);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View
          style={{
            padding: 10,
          }}
        >
          {/* 有按讚的人、留言的人 */}
          <FlatList
            data={postInteractions}
            keyExtractor={(item) => item.user.userId}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },

  itemView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    // borderWidth: 1,
  },
  text: {
    // flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  text1: {
    // flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.icon,
    // // fontWeight: "bold",
  },
});

export default PostInteractions;
