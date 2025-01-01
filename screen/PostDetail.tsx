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
import { PostDetail as PostDetailType } from "../shared/types";

interface PostDetailProps {
  route: {
    params: {
      postDetail: PostDetailType;
    };
  };
  navigation: NavigationProp<any>;
}
//貼文內容
const PostDetail: React.FC<PostDetailProps> = ({ route, navigation }) => {
  const { postDetail } = route.params;

  const personal = useAppSelector(selectUser);

  useEffect(() => {
    navigation.setOptions({
      title: null,

      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  console.log("postDetail", postDetail);
  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* 貼文內容 */}
          <Post
            userState={
              postDetail.user.userId === personal.userId ? "personal" : "friend"
            } // 這個到時候 要看說是訪客還是朋友
            postDetail={postDetail}
          />

          <View
            style={{
              marginTop: 10,
            }}
          />
          {/* 留言 */}
          {postDetail.postComments.map((comment) => {
            return <Comments />;
          })}
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

export default PostDetail;
