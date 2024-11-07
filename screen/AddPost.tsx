import { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import BackButton from "../components/ui/BackButton";
import { Colors } from "../constants/style";
import CustomIcon from "../components/ui/CustomIcon";
import { X } from "lucide-react-native";
import AlertDialog from "../components/ui/AlertDialog";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Modalize } from "react-native-modalize";

// 新增文章
const AddPost = ({ navigation }) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const modalizeRef = useRef(null);

  const openBottomDrawer = () => {
    modalizeRef.current?.open();
  };
  useEffect(() => {
    navigation.setOptions({
      title: "新增文章",
      headerTitleAlign: "center",
      headerLeft: () => (
        <CustomIcon onPress={() => setIsAlertVisible(true)}>
          <X color={Colors.icon} size={25} />
        </CustomIcon>
      ),
    });
  }, [navigation]);

  // 關閉 新增文章
  const handleClosePost = () => {
    setIsAlertVisible(false);
    navigation.goBack();
  };

  // 關閉警告視窗
  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  return (
    <>
      <AlertDialog
        label="文章"
        isVisible={isAlertVisible}
        onCloseAlert={handleCloseAlert}
        onClosePost={handleClosePost}
      />

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
          <TouchableOpacity style={styles.tagButton} onPress={openBottomDrawer}>
            <AntDesign name="tag" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <Modalize ref={modalizeRef} snapPoint={300}>
        <View style={{ padding: 20 }}>
          <Text>這是底部抽屜內容</Text>
        </View>
      </Modalize>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  postContainer: {
    // borderWidth: 1,
    // borderColor: "#f5f5f5",
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
  drawer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cancelButton: {
    marginRight: 8,
  },
  cancelText: {
    color: "#666",
    fontSize: 14,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addText: {
    color: "#fff",
    fontSize: 14,
  },
  tagList: {
    flex: 1,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tagText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});
export default AddPost;
