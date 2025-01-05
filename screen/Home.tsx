import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Post from "../components/post/Post";
import { Search } from "lucide-react-native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { Colors } from "../constants/style";
import CustomFAB from "../components/ui/CustomFAB";
import { PaperProvider } from "react-native-paper";
import {
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

// export const postList = Array(14).fill({
//   date: "2024/08/02",
// });

interface HomePostProps {
  navigation: NavigationProp<any>;
}
const Home: React.FC<HomePostProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  // 監聽 新文章變化
  usePostListeners();

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
      const { data: friendList, success } = await getFriendList(
        personal.userId
      );
      if (!success) {
        console.log("取得好友列表 錯誤");
        return;
      }

      dispatch(setFriendList(friendList));
    };

    fetchAllPosts();
    fetchFriendList();
  }, [dispatch, personal.userId]);

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
              {/* 
              TODO:userState 是用來判斷要不要出現  menu的 所以到時候可以rename
              showMenu
              首頁還是不要出現 可以編輯或刪除, 要點進去內文才可以 */}
              <Post
                userState={"friend"} // 這個到時候 要看說是訪客還是朋友
                postDetail={post}
              />
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
