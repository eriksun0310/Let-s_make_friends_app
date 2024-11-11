import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/userInfo/HeadShot";
import { RootState, useDispatch } from "../store/store";
import { logout } from "../store/userSlice";
import { useSelector } from "react-redux";
import { Colors } from "../constants/style";
import UserCollapse from "../components/userInfo/UserCollapse";
import PostPermissionsSettings from "../components/post/PostPermissionsSettings";
import Post from "../components/post/Post";
import { UserState } from "../shared/types";
import { PaperProvider } from "react-native-paper";
import BackButton from "../components/ui/button/BackButton";
import Button from "../components/ui/button/Button";

interface UserInfoProps {
  route: { params: { mode: UserState } };
  navigation: NavigationProp<any>;
}

export const postList = Array(14).fill({
  date: "2024/08/02",
});

// TODO: user 資料要用傳的
const UserInfo: React.FC<UserInfoProps> = ({ route, navigation }) => {
  const { mode } = route.params || { mode: "personal" };
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  // console.log("UserInfo   ", user);
  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigation.navigate("login");
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: mode === "personal" ? "個人資料" : "好友資料",
      headerTitleAlign: "center",
      headerLeft: () => {
        if (mode === "friend") {
          return <BackButton navigation={navigation} />;
        } else return null;
      },
    });
  }, [navigation]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 大頭貼 */}
          <HeadShot
            nameValue={user.name}
            navigation={navigation}
            headShot={user.headShot}
          />

          <UserCollapse navigation={navigation} />
          <View
            style={{
              marginTop: 10,
            }}
          />

          {mode === "personal" && <PostPermissionsSettings />}

          <View style={{ marginTop: 10 }} />

          {postList?.map((post) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("postContent")}
            >
              <Post mode="personal" date={post.date} user={user} />
            </TouchableOpacity>
          ))}

          {mode === "personal" && (
            <View style={styles.formContainer}>
              <Button
                style={{
                  width: "50%",
                }}
                text="登出"
                onPress={handleLogout}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    display: "flex",
    marginVertical: 30,
    alignItems: "center",
  },
});

export default UserInfo;
