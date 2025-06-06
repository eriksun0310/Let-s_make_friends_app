import React, { useState } from "react";
import { Menu } from "react-native-paper";
import { StyleSheet, TouchableOpacity } from "react-native";
import { EllipsisVertical } from "lucide-react-native";
import { Colors } from "../../constants/style";
import {
  deletePost,
  selectPosts,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { deletePostDB } from "../../util/handlePostEvent";
import AlertDialog from "./AlertDialog";
import { useNavigation } from "@react-navigation/native";
const CustomMenu = ({ postId }: { postId: string }) => {
  const navigation = useNavigation();
  const postData = useAppSelector(selectPosts);
  const dispatch = useAppDispatch();

  // menu 狀態
  const [menuVisible, setMenuVisible] = useState(false);

  // 警告視窗 開啟狀態
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // 警告提醒
  const [alertTitle, setAlertTitle] = useState("");

  const showMenu = () => {
    setMenuVisible(true);
  };

  // 點擊 menu 編輯
  const clickEditMenu = (postId: string) => {
    setMenuVisible(false);
    // 找出要編輯的文章
    const editPost = postData.find((post) => post.post.id === postId);

    navigation.navigate("postContent", {
      mode: "edit",
      editPost: {
        post: editPost?.post,
        tags: editPost?.tags,
      },
    });
    // 開啟 addPost 傳mode= 'edit'、updatePost
  };

  // 點擊 menu 刪除
  const clickDeleteMenu = async () => {
    setMenuVisible(false);
    //alert
    setIsAlertVisible(true);
    setAlertTitle("確認要刪除這則文章？");
  };

  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  // 點擊 確認刪除文章
  const handleClickDelete = async () => {
    const { success } = await deletePostDB({ postId });
    if (success) {
      dispatch(deletePost(postId));
      setIsAlertVisible(false);
      navigation.goBack();
    }
  };

  return (
    <>
      <AlertDialog
        alertTitle={alertTitle}
        leftBtnText="取消"
        rightBtnText="確認"
        isVisible={isAlertVisible}
        leftBtnOnPress={handleCloseAlert}
        rightBtnOnPress={handleClickDelete}
        onBackdropPress={handleCloseAlert}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <EllipsisVertical color={Colors.icon} />
          </TouchableOpacity>
        }
        contentStyle={[styles.menuContent, { marginTop: -56 }]} // 調整選單位置
      >
        <Menu.Item
          onPress={() => clickEditMenu(postId)}
          title="編輯"
          style={{
            marginHorizontal: 10,
            height: 30,
          }}
        />
        <Menu.Item
          onPress={clickDeleteMenu}
          title="刪除"
          style={{
            marginHorizontal: 10,
          }}
          titleStyle={{ color: "#ff0000" }}
        />
      </Menu>
    </>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    backgroundColor: "#fff",
    elevation: 8,
    width: 90,
    height: 85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CustomMenu;
