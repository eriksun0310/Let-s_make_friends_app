import { View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";

import { NavigationProp } from "@react-navigation/native";
import Comments from "../components/post/Comments";

import EnterComments from "../components/post/EnterComments";
import { PaperProvider } from "react-native-paper";
import Post from "../components/post/Post";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import BackButton from "../components/ui/button/BackButton";
import { selectUser, useAppSelector } from "../store";

interface PostContentProps {
  navigation: NavigationProp<any>;
}
//貼文內容
const PostContent: React.FC<PostContentProps> = ({ navigation }) => {
  const personal = useAppSelector(selectUser);

  useEffect(() => {
    navigation.setOptions({
      title: null,

      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);
  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* 貼文內容 */}
          <Post mode="personal" date="2024/08/02" user={personal} />

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
