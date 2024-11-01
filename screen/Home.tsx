import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { FAB, Portal, PaperProvider } from "react-native-paper";
import Post from "../components/post/Post";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Colors } from "../constants/style";

// const postList = ["2024/08/02"];

export const postList = Array(14).fill({
  date: "2024/08/02",
});
const Home = () => {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  const user = useSelector((state: RootState) => state.user.user);
  return (
    <View style={styles.screen}>
      <PaperProvider>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {postList?.map((post) => (
            <Post date={post.date} user={user} />
          ))}
        </ScrollView>
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon={open ? "chevron-down" : "chevron-up"}
            actions={[
              {
                icon: "pencil",
                label: "寫文章",
                onPress: () => console.log("Pressed star"),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </PaperProvider>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default Home;
