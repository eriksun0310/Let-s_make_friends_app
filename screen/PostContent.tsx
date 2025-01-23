import { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "../constants/style";
import CustomIcon from "../components/ui/button/CustomIcon";
import { X } from "lucide-react-native";
import AlertDialog from "../components/ui/AlertDialog";
import AntDesign from "@expo/vector-icons/AntDesign";
import TagSelector from "../components/ui/TagSelector";
import SelectedTagText from "../components/ui/SelectedTagText";
import SegmentedButtons from "../components/ui/button/SegmentedButtons";
import { segmentedButtons } from "../shared/static";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NavigationProp } from "@react-navigation/native";
import {
  addPost,
  selectUser,
  updatePost,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { addPostDB, updatePostDB } from "../util/handlePostEvent";
import { EditPost, PostDetail, PostVisibility } from "../shared/types";
import { Avatar } from "@rneui/themed";

const title = {
  edit: "編輯",
  add: "新增",
};

const postBtn = {
  edit: "編輯",
  add: "發布",
};

interface PostState {
  userId: string;
  content: string; // 文章內容
  visibility: PostVisibility; // 文章權限
  tags: string[]; // 文章標籤
}

interface PostContentProps {
  route: {
    params: {
      mode: "add" | "edit";
      editPost: EditPost | null;
    };
  };
  navigation: NavigationProp<any>;
}
// 文章內容(add、edit)
const PostContent: React.FC<PostContentProps> = ({ route, navigation }) => {
  const { mode, editPost } = route.params;

  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const modalizeRef = useRef<{
    open: () => void;
    close: () => void;
  }>(null);

  const [post, setPost] = useState<PostState>({
    userId: personal.userId,
    content: "", // 文章內容
    visibility: "public", // 文章權限
    tags: [], // 文章標籤
  });

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
  const handleRemoveTag = (tag: string) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((i) => i !== tag),
    }));
  };

  // 按下發布文章
  const handleClickPostBtn = async (currentPost: PostState) => {
    let result = {};

    // 編輯文章
    if (mode === "edit" && editPost) {
      result = await updatePostDB({
        updatedPost: {
          postId: editPost.post.id,
          ...currentPost,
        },
      });
    } else if (mode === "add") {
      result = await addPostDB({
        newPost: currentPost,
      });
    }

    const resultPost = {
      ...result.data,
      user: personal,
    } as PostDetail;

    console.log("resultPost 111111", resultPost);

    // 發佈文章成功
    if (result.success) {
      console.log("result.resultPost 發布文章", result.data);

      if (mode === "edit") {
        dispatch(updatePost(resultPost));
      } else if (mode === "add") {
        dispatch(addPost(resultPost));
      }

      // 關閉 新增文章 page
      navigation.goBack();
    }
  };

  // 處理 post 的狀態設置
  const handlePostChange = ({
    name,
    value,
  }: {
    name: "content" | "visibility" | "tags";
    value: string | string[];
  }) => {
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${title[mode]}文章`,
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
          style={{ marginHorizontal: 15 }}
          onPress={() => handleClickPostBtn(post)}
        >
          <Text style={{ color: Colors.textBlue }}>{postBtn[mode]}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, post]);

  // 把編輯文章帶進來
  useEffect(() => {
    if (mode === "edit" && editPost) {
      setPost({
        userId: editPost.post.userId,
        content: editPost.post.content,
        visibility: editPost.post.visibility,
        tags: editPost.tags,
      });
    }
  }, [mode]);

  return (
    <>
      <AlertDialog
        alertTitle="如果現在捨棄，系統將不會儲存這則文章"
        leftBtnText="捨棄文章"
        rightBtnText="繼續編輯"
        isVisible={isAlertVisible}
        leftBtnOnPress={handleClosePost}
        rightBtnOnPress={handleCloseAlert}
        onBackdropPress={handleCloseAlert}
        leftButtonStyle={{
          backgroundColor: "#ffcccc",
        }}
        leftTitleStyle={{
          color: "#d9534f",
        }}
        rightButtonStyle={{
          backgroundColor: "#e1f5fe",
        }}
        rightTitleStyle={{
          color: "#0277bd",
        }}
      />

      <>
        <View style={styles.container}>
          <View style={styles.postContainer}>
            <View style={styles.header}>
              <Avatar
                containerStyle={styles.avatar}
                source={personal.headShot.imageUrl as ImageSourcePropType}
              />
              <Text style={styles.username}>{personal.name}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="在想什麼...."
              placeholderTextColor="#999"
              multiline
              onChangeText={(v) =>
                handlePostChange({
                  name: "content",
                  value: v,
                })
              }
              value={post.content}
            />

            {/* 文章標籤 */}
            <View style={styles.tagContainer}>
              <TouchableOpacity
                style={styles.tagButton}
                onPress={openBottomDrawer}
              >
                <AntDesign name="tag" size={24} color={Colors.tag} />
              </TouchableOpacity>

              {/* 文章顯示的tag */}
              {post.tags.length > 0 && (
                <SelectedTagText
                  selectedTags={post.tags}
                  removeTag={handleRemoveTag}
                />
              )}
            </View>

            {/* 文章權限設定 */}
            <View style={styles.eyeContainer}>
              <View style={{ marginLeft: 10 }}>
                <MaterialCommunityIcons
                  name="account-eye"
                  size={30}
                  color={Colors.tag}
                />
              </View>

              <SegmentedButtons
                buttons={segmentedButtons("addPost")}
                onValueChange={(v) =>
                  handlePostChange({
                    name: "visibility",
                    value: v,
                  })
                }
                initialValue={post.visibility}
              />
            </View>
          </View>
        </View>

        {/* tag 選擇器 */}
        <TagSelector
          defaultPostTags={post.tags}
          modalizeRef={modalizeRef}
          getSelectedItems={(v) =>
            handlePostChange({
              name: "tags",
              value: v,
            })
          }
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
  eyeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
export default PostContent;
