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
  setPosts,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { getAllPosts } from "../util/handlePostEvent";
import { NavigationProp } from "@react-navigation/native";

// export const postList = Array(14).fill({
//   date: "2024/08/02",
// });

interface HomePostProps {
  navigation: NavigationProp<any>;
}
const Home: React.FC<HomePostProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const postData = useAppSelector(selectPosts);

  const { open } = state;
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
    const fetchAllPosts = async () => {
      const allPosts = await getAllPosts({
        userId: personal.userId,
      });
      // console.log("postData", allPosts);

      dispatch(setPosts(allPosts));
    };

    fetchAllPosts();
  }, [personal.userId]);

  console.log("postData redux", postData);

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <ScrollView>
          {postData?.map((post) => (
            <TouchableOpacity
              key={post.post.id}
              onPress={() =>
                navigation.navigate("postDetail", {
                  postDetail: post,
                })
              }
            >
              <Post
                userState={
                  post.user.userId === personal.userId ? "personal" : "friend"
                } // 這個到時候 要看說是訪客還是朋友
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
