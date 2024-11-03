import { View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";
import BackButton from "../components/ui/BackButton";
import { NavigationProp } from "@react-navigation/native";
import Comments from "../components/post/Comments";

import EnterComments from "../components/post/EnterComments";
import { PaperProvider } from "react-native-paper";
import Post from "../components/post/Post";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface PostContentProps {
  navigation: NavigationProp<any>;
}
//貼文內容
const PostContent: React.FC<PostContentProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    navigation.setOptions({
      title: null,

      headerLeft: () => <BackButton navigation={navigation} />,
    });
  }, [navigation]);
  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* 貼文內容 */}
          <Post mode="personal" date="2024/08/02" user={user} />

          <View
            style={{
              marginTop: 10,
            }}
          />
          {/* 留言 */}
          <Comments />
          <Comments />
        </ScrollView>

        {/* 輸入留言 */}
        <EnterComments />
      </View>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#e6f3ff",
  },
  scrollView: {
    flex: 1,
  },
});

export default PostContent;
