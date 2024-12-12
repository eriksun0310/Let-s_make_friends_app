import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Post from "../components/post/Post";
import { Search } from "lucide-react-native";
import CustomIcon from "../components/ui/button/CustomIcon";
import { Colors } from "../constants/style";
import CustomFAB from "../components/ui/CustomFAB";
import {  PaperProvider } from "react-native-paper";
import { selectUser, useAppSelector } from "../store";

export const postList = Array(14).fill({
  date: "2024/08/02",
});
const Home = ({ navigation }) => {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

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
  return (
    <PaperProvider>
      <View style={styles.screen}>
        <ScrollView>
          {postList?.map((post) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("postContent")}
            >
              <Post mode="personal" date={post.date} user={personal} />
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
