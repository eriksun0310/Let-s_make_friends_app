import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Post from "../components/post/Post";
import { Search } from "lucide-react-native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { Colors } from "../constants/style";
import CustomFAB from "../components/ui/CustomFAB";
import { PaperProvider } from "react-native-paper";
import {
  selectFriendList,
  selectPosts,
  selectUser,
  setFriendList,
  setPosts,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { getAllPosts } from "../util/handlePostEvent";
import { NavigationProp } from "@react-navigation/native";
import { usePostListeners } from "../components/hooks/usePostListeners";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { getFriendList } from "../util/handleFriendsEvent";
import { usePostLikesListeners } from "../components/hooks/usePostLikesListeners";

// export const postList = Array(14).fill({
//   date: "2024/08/02",
// });

interface HomePostProps {
  navigation: NavigationProp<any>;
}
const Home: React.FC<HomePostProps> = ({ navigation }) => {
  const friendList = useAppSelector(selectFriendList);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  // 監聽 新文章變化
  usePostListeners();

  // 間聽文章按讚
  usePostLikesListeners();

  const postData = useAppSelector(selectPosts);

  const personal = useAppSelector(selectUser);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomIcon onPress={() => navigation.navigate("search")}>
          <Search color={Colors.icon} size={25} />
        </CustomIcon>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    // 初始化加載的文章
    const fetchAllPosts = async () => {
      const {
        data: allPosts,
        success,
        errorMessage: allPostsError,
      } = await getAllPosts({
        userId: personal.userId,
      });

      if (!success) {
        console.log("getAllPosts error", allPostsError);
        setLoading(false);
        return;
      }
      dispatch(setPosts(allPosts));

      setLoading(false);
    };

    // 取得好友列表
    const fetchFriendList = async () => {
      const { data: friendList, success } = await getFriendList({
        currentUserId: personal.userId,
      });
      if (!success) {
        console.log("取得好友列表 錯誤");
        return;
      }

      dispatch(setFriendList(friendList));
    };

    fetchAllPosts();
    fetchFriendList();
  }, [dispatch, personal.userId]);

  console.log("postData", postData);
  if (loading) return <LoadingOverlay message=" searching ..." />;

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <ScrollView>
          {postData?.map((post) => (
            <TouchableOpacity
              key={post.post.id}
              onPress={() =>
                navigation.navigate("postDetail", {
                  postId: post.post.id,
                })
              }
            >
              <Post screen="home" userState={"friend"} postDetail={post} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <CustomFAB navigation={navigation} />
      </View>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default Home;
