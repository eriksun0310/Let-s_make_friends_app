import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/personal/HeadShot";
import Button from "../components/ui/Button";
import TextLabel from "../components/ui/Text";

import { RootState, useDispatch } from "../store/store";
import SelectedOption from "../components/aboutMe/SelectedOption";
import { logout } from "../store/userSlice";
import { useSelector } from "react-redux";
import { calculateAge, getZodiacSign } from "../shared/funcs";
import { gender } from "../shared/static";

import { List, Menu } from "react-native-paper";
import { EllipsisVertical } from "lucide-react-native";
import { Colors } from "../constants/style";
import { color } from "@rneui/base";
import SegmentedButtons from "../components/ui/SegmentedButtons";

import { ListItem } from "@rneui/themed";
import ProfileList from "../components/personal/ProfileList";
import PostPermissionsSettings from "../components/post/PostPermissionsSettings";
import Post from "../components/post/Post";

interface PersonalProps {
  navigation: NavigationProp<any>;
}

const buttons = [
  {
    value: "all",
    label: "全部",
  },
  {
    value: "public",
    label: "公開",
  },
  {
    value: "friends",
    label: "朋友",
  },
];
const Personal: React.FC<PersonalProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const [expanded, setExpanded] = useState(false);
  const [visibility, setVisibility] = useState("all");
  const [menuVisible, setMenuVisible] = useState(false);

  console.log("user", user);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigation.navigate("login");
    });
  };

  // const renderArticle = (date: string) => (
  //   <View style={styles.articleContainer}>
  //     <View style={styles.articleHeader}>
  //       <View style={styles.userInfo}>
  //         <Image
  //           source={user.headShot?.imageUrl}
  //           style={styles.articleAvatar}
  //         />
  //         <Text style={styles.userName}>{user.name}</Text>
  //         <Text style={styles.articleDate}>{date}</Text>
  //       </View>
  //       <Menu
  //         visible={menuVisible}
  //         onDismiss={() => setMenuVisible(false)}
  //         // anchor={<Button onPress={() => setMenuVisible(true)}>⋮</Button>}
  //         anchor={
  //           <TouchableOpacity>
  //             <EllipsisVertical color={Colors.icon} />
  //           </TouchableOpacity>
  //         }
  //       >
  //         <Menu.Item onPress={() => {}} title="編輯" />
  //         <Menu.Item onPress={() => {}} title="刪除" />
  //       </Menu>
  //     </View>
  //     <Text style={styles.articleContent}>這是我的第一篇文章</Text>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot
          nameValue={user.name}
          navigation={navigation}
          headShot={user.headShot}
        />

        <ProfileList />
        <View
          style={{
            marginTop: 10,
          }}
        />

        <PostPermissionsSettings />
        <View
          style={{
            marginTop: 10,
          }}
        />

        <Post date="2024/08/02" user={user} />
        <Post date="2024/08/02" user={user} />

        <Post date="2024/08/02" user={user} />
        <View style={styles.formContainer1}>
          <Button
            style={{
              width: "50%",
            }}
            text="登出"
            onPress={handleLogout}
          />
        </View>
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
});

export default Personal;
