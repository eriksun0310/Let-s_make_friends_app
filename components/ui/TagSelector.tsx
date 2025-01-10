import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Modalize } from "react-native-modalize";
import CustomIcon from "./button/CustomIcon";
import { Plus, SearchIcon, X } from "lucide-react-native";
import { Colors } from "../../constants/style";
import Fieldset from "./Fieldset";
import SelectedTagText from "./SelectedTagText";
import { getTags } from "../../util/handlePostEvent";

// 模擬搜尋選項數據
// const mockOptions = ["嗨", "嗨嗨", "嗨你好", "123456", "4561"];
export const mockOptions = Array.from(
  { length: 335 },
  (_, index) => 111 + index
);

interface TagSelectorProps {
  modalizeRef: React.RefObject<Modalize>;
  defaultPostTags: string[];
  getSelectedItems: (v: string[]) => void; // 取得選擇的tag
  onCloseDrawer: () => void; // 關閉 bottom drawer
}
const TagSelector = ({
  modalizeRef,
  defaultPostTags,
  getSelectedItems,
  onCloseDrawer,
}: TagSelectorProps) => {
  // PostTags 資料
  const [postTags, setPostTags] = useState<string[]>([]);

  // 已選擇的tag
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // 搜尋文字
  const [searchText, setSearchText] = useState("");

  // 新增選項

  const handleSelect = (tag: string) => {
    //新增已選擇的tag
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }

    // 沒有搜尋文字, 就清空 searchText
    // if (filteredOptions.length === 1) {
    //   setSearchText("");
    // }
  };

  // 移除 tag
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((i) => i !== tag));
  };

  // const isNumeric = /^\d+$/;

  // 過濾 tag
  // const filteredOptions = mockOptions.filter((option) => {
  //   // 如果 searchText 是數字，則篩選包含該數字的選項
  //   if (isNumeric.test(searchText)) {
  //     return (
  //       option.toString().includes(searchText) && !selectedTags.includes(option)
  //     );
  //   }
  //   // 如果 searchText 包含非數字，則返回空數組或按其他邏輯處理
  //   return false;
  // });
  
  
  // 過濾符合條件的tag
  const filteredTag = postTags.filter((tag) =>
    tag.toLowerCase().includes(searchText.toLowerCase())
  );

  // 判斷輸入的文字是否在postTags中
  const hasPostTags = postTags.some(
    (tag) => tag.toLowerCase() === searchText.toLowerCase()
  );

  // 新增 tag (輸入 不存在在 postTags 中的文字)
  const addTag = (searchText: string) => {
    if (!selectedTags.includes(searchText)) {
      setSelectedTags([...selectedTags, searchText]);
      setSearchText("");
    }
  };

  useEffect(() => {
    setSelectedTags(defaultPostTags);
  }, [defaultPostTags]);

  // 取得 PostTags 資料庫的資料
  useEffect(() => {
    const fetchPostTags = async () => {
      const { data: postTags } = await getTags();
      setPostTags(postTags);
    };

    fetchPostTags();
  }, []);
  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={650}
      modalHeight={650}
      // closeOnOverlayTap={false} // 點擊背景 不要關閉
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTags([]);
              onCloseDrawer();
            }}
          >
            <Text style={styles.leftText}>取消</Text>
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <CustomIcon style={{ marginHorizontal: 0 }}>
              <SearchIcon color={Colors.icon} size={25} />
            </CustomIcon>
            <TextInput
              value={searchText}
              placeholder="搜尋"
              style={styles.searchInput}
              onChangeText={(e) => setSearchText(e)}
            />

            {searchText &&
              (hasPostTags ? (
                <CustomIcon
                  style={{
                    marginRight: 0,
                  }}
                  onPress={() => setSearchText("")}
                >
                  <X color={Colors.icon} size={25} />
                </CustomIcon>
              ) : (
                <CustomIcon
                  style={{
                    marginRight: 0,
                  }}
                  onPress={() => addTag(searchText)}
                >
                  <Plus color={Colors.icon} size={25} />
                </CustomIcon>
              ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              getSelectedItems(selectedTags);
              onCloseDrawer();
            }}
          >
            <Text style={styles.rightText}>新增</Text>
          </TouchableOpacity>
        </View>

        {/* 已選 tag  */}
        {selectedTags.length > 0 && (
          <View style={styles.selectedSection}>
            <Fieldset title="已選擇的標籤">
              <SelectedTagText
                selectedTags={selectedTags}
                removeTag={handleRemoveTag}
              />
            </Fieldset>
          </View>
        )}

        {/*  tag  資料*/}
        <ScrollView style={styles.optionsContainer}>
          {filteredTag?.map((tag) => {
            return (
              <TouchableOpacity
                key={tag}
                style={styles.option}
                onPress={() => handleSelect(tag)}
              >
                <Text style={styles.optionText}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  selectedSection: {
    marginTop: 10,
    padding: 12,
  },

  optionsContainer: {
    flex: 1, // 這裡讓 ScrollView 佔用剩餘空間
    paddingHorizontal: 16,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efefef",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  leftText: {
    fontSize: 17,
    color: "#FE2121",
    marginLeft: 8,
  },
  rightText: {
    fontSize: 17,
    color: Colors.textBlue,
    marginRight: 8,
  },
});
export default TagSelector;
