import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/userInfo/HeadShot";
import Button from "../components/ui/Button";
import { RootState, useDispatch } from "../store/store";
import { logout } from "../store/userSlice";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react-native";
import { Colors } from "../constants/style";

import UserCollapse from "../components/userInfo/UserCollapse";
import PostPermissionsSettings from "../components/post/PostPermissionsSettings";
import Post from "../components/post/Post";
import { UserInfoMode } from "../shared/types";

interface UserInfoProps {
  route: { params: { mode: UserInfoMode } };
  navigation: NavigationProp<any>;
}

// TODO: user 資料要用傳的
const UserInfo: React.FC<UserInfoProps> = ({ route, navigation }) => {
  const { mode } = route.params || { mode: "personal" };
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

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
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerIcon}
            >
              <ChevronLeft size={30} color={Colors.icon} />
            </TouchableOpacity>
          );
        } else return null;
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot
          nameValue={user.name}
          navigation={navigation}
          headShot={user.headShot}
        />

        <UserCollapse />
        <View
          style={{
            marginTop: 10,
          }}
        />

        {mode === "personal" && <PostPermissionsSettings />}

        <View
          style={{
            marginTop: 10,
          }}
        />

        <Post mode={mode} date="2024/08/02" user={user} />
        <Post mode={mode} date="2024/08/02" user={user} />

        <Post mode={mode} date="2024/08/02" user={user} />

        {mode === "personal" && (
          <View style={styles.formContainer1}>
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
  formContainer1: {
    display: "flex",
    marginTop: 100,
    alignItems: "center",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  visibilityContainer: {
    marginTop: 16,
    backgroundColor: "#ffff",
    padding: 16,
  },
  articleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    marginRight: 10,
  },
  articleDate: {
    color: "#888",
  },
  articleContent: {
    marginTop: 10,
  },
  headerIcon: {
    marginHorizontal: 10,
  },
});

export default UserInfo;
