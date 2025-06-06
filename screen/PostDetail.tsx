import { View, StyleSheet, ScrollView, Text } from "react-native";
import React, { useEffect } from "react";
import { NavigationProp } from "@react-navigation/native";
import Comments from "../components/post/Comments";
import EnterComments from "../components/post/EnterComments";
import { PaperProvider } from "react-native-paper";
import Post from "../components/post/Post";
import BackButton from "../components/ui/button/BackButton";
import { selectPosts, selectUser, useAppSelector } from "../store";
import { PostDetail as PostDetailType } from "../shared/types";
import LikeDrawer from "../components/post/like/LikeDrawer";

interface PostDetailProps {
  route: {
    params: {
      postId: string;
    };
  };
  navigation: NavigationProp<any>;
}

//貼文內容
const PostDetail: React.FC<PostDetailProps> = ({ route, navigation }) => {
  const { postId } = route.params;
  const postData = useAppSelector(selectPosts);


  console.log('postData', postData)
  // 目前的貼文
  const currentPost = postData.find(
    (post) => post.post.id === postId
  ) as PostDetailType;

  const userSettings = currentPost?.user?.settings;

  const personal = useAppSelector(selectUser);

  useEffect(() => {
    navigation.setOptions({
      title: null,

      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  console.log("currentPost", currentPost);

  useEffect(() => {
    // 文章被刪除
    if (!currentPost) {
      const timeoutId = setTimeout(() => {
        navigation.goBack();
      }, 1500);

      // 清除定時器
      return () => clearTimeout(timeoutId);
    }
  }, [currentPost]);

  console.log("currentPost", currentPost);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* 貼文內容 */}
          {!currentPost ? (
            <View style={styles.deleteTextView}>
              <Text style={styles.deleteText}>
                文章已被刪除,即將返回首頁....
              </Text>
            </View>
          ) : (
            <Post
              screen="postDetail"
              userState={
                currentPost?.user?.userId === personal?.userId
                  ? "personal"
                  : "friend"
              } // 這個到時候 要看說是訪客還是朋友
              postDetail={currentPost || {}}
              showTags={true}
            />
          )}

          <View style={{ marginTop: 10 }} />
          {/* 留言 */}
          {!userSettings?.hideComments &&
            currentPost?.user?.userId === personal.userId && (
              <>
                {currentPost?.postComments.map((comment) => {
                  return <Comments />;
                })}
              </>
            )}
        </ScrollView>

        {/* 輸入留言 */}
        {currentPost && <EnterComments />}
      </View>

      <LikeDrawer postLikes={currentPost?.postLikes} />
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
  deleteTextView: {
    alignItems: "center",
    marginTop: 10,
  },
  deleteText: {
    fontSize: 20,
  },
});

export default PostDetail;
