import { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Colors } from "../constants/style";
import CustomIcon from "../components/ui/button/CustomIcon";
import { X } from "lucide-react-native";
import AlertDialog from "../components/ui/AlertDialog";
import AntDesign from "@expo/vector-icons/AntDesign";

import TagSelector from "../components/ui/TagSelector";
import SelectedTagText from "../components/ui/SelectedTagText";

// 新增文章
const AddPost = ({ navigation }) => {
  const modalizeRef = useRef(null);

  // 顯示在文章上的tag
  const [postTags, setPostTags] = useState<string[]>([]);
  // 警告視窗 開啟狀態
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // 關閉 新增文章 page
  const handleClosePost = () => {
    setIsAlertVisible(false);
    navigation.goBack();
  };

  // 關閉警告視窗
  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  // 打開 bottom drawer
  const openBottomDrawer = () => {
    modalizeRef.current?.open();
  };

  // 關閉 bottom drawer
  const handleCloseDrawer = () => {
    modalizeRef.current?.close();
  };

  // 移除 tag
  const handleRemoveTag = (item: string) => {
    setPostTags(postTags.filter((i) => i !== item));
  };

  useEffect(() => {
    navigation.setOptions({
      title: "新增文章",
      headerTitleAlign: "center",
      headerLeft: () => (
        <CustomIcon
          onPress={() => {
            setIsAlertVisible(true);
          }}
        >
          <X color={Colors.icon} size={25} />
        </CustomIcon>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginHorizontal: 15,
          }}
        >
          <Text
            style={{
              color: Colors.textBlue,
            }}
          >
            發布
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      <AlertDialog
        label="文章"
        isVisible={isAlertVisible}
        onCloseAlert={handleCloseAlert}
        onClosePost={handleClosePost}
      />

      <>
        <View style={styles.container}>
          <View style={styles.postContainer}>
            <View style={styles.header}>
              <Image
                source={require("../assets/animal/ostrich.png")}
                style={styles.avatar}
              />
              <Text style={styles.username}>海鷗</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="在想什麼...."
              placeholderTextColor="#999"
              multiline
            />

            <View style={styles.tagContainer}>
              <TouchableOpacity
                style={styles.tagButton}
                onPress={openBottomDrawer}
              >
                <AntDesign name="tag" size={24} color={Colors.tag} />
              </TouchableOpacity>

              {/* 文章顯示的tag */}
              {postTags.length > 0 && (
                <SelectedTagText
                  selectedTags={postTags}
                  removeTag={handleRemoveTag}
                />
              )}
            </View>
          </View>
        </View>

        {/* tag 選擇器 */}
        <TagSelector
          defaultTag={postTags}
          modalizeRef={modalizeRef}
          getSelectedItems={(v) => {
            setPostTags(v);
          }}
          onCloseDrawer={handleCloseDrawer}
        />
      </>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 16,
    borderRadius: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  tagButton: {
    padding: 8,
  },
  tagContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
export default AddPost;
