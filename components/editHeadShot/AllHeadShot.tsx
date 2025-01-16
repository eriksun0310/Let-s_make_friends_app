import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "../../constants/style";
import { HeadShot, ImageType } from "../../shared/types";
import man from "../../assets/people/man/man.png";
import man1 from "../../assets/people/man/man (1).png";
import man2 from "../../assets/people/man/man (2).png";
import woman from "../../assets/people/woman/girl.png";
import woman1 from "../../assets/people/woman/woman (1).png";
import woman2 from "../../assets/people/woman/woman (2).png";
import woman3 from "../../assets/people/woman/woman (3).png";
import ostrich from "../../assets/animal/ostrich.png";
import { Avatar, Tab, TabView } from "@rneui/themed";
import { headShotTabsTitle } from "../../shared/static";
export const imageUrls: Record<ImageType, Array<ImageSourcePropType | any>> = {
  people: [
    { imageUrl: man },
    { imageUrl: man1 },
    { imageUrl: man2 },
    { imageUrl: woman },
    { imageUrl: woman1 },
    { imageUrl: woman2 },
    { imageUrl: woman3 },
  ],
  animal: [{ imageUrl: ostrich }],
};

interface AllHeadShotProps {
  headShot: HeadShot;
  setHeadShot: React.Dispatch<React.SetStateAction<HeadShot>>;
}
const AllHeadShot: React.FC<AllHeadShotProps> = ({ headShot, setHeadShot }) => {
  const [index, setIndex] = useState(0);

  // 切換tab
  const handleTabChange = (newIndex: number) => {
    setIndex(newIndex);
    // 根據 index 找到對應的 imageType
    const newImageType = Object.keys(imageUrls)[newIndex] as ImageType;

    // 更新 headShot.imageType
    setHeadShot((prev) => ({
      ...prev,
      imageType: newImageType,
    }));
  };

  // 當前選的大頭貼
  // useEffect(() => {
  //   const index = Object.keys(imageUrls).indexOf(headShot.imageType);

  //   if (index !== -1) {
  //     setIndex(index);
  //   }
  // }, [headShot]);

  // 初始化時設置 index
  useEffect(() => {
    const initialIndex = Object.keys(imageUrls).indexOf("animal");
    if (initialIndex !== -1) {
      setIndex(initialIndex);
    }
  }, [headShot.imageType]);
  return (
    <>
      {/* tab */}
      <View style={styles.tab}>
        <Tab
          value={index}
          onChange={handleTabChange}
          dense
          indicatorStyle={{
            backgroundColor: Colors.textBlue,
            height: 3,
          }}
        >
          {Object.keys(imageUrls)?.map((key) => (
            <Tab.Item
              key={key}
              titleStyle={(active) =>
                active
                  ? {
                      color: Colors.textBlue,
                    }
                  : {
                      color: Colors.text,
                    }
              }
            >
              {headShotTabsTitle[key as ImageType]}
            </Tab.Item>
          ))}
        </Tab>

        <TabView
          value={index}
          onChange={handleTabChange}
          animationType="timing"
        >
          {Object.keys(imageUrls).map((key) => (
            <TabView.Item key={key}>
              <View style={styles.optionsContainer}>
                {imageUrls[key as ImageType].map((item) => (
                  <TouchableOpacity
                    key={item.imageUrl}
                    style={styles.option}
                    onPress={() => {
                      setHeadShot((prev) => ({
                        ...prev,
                        imageType: key as ImageType, // 更新為當前的類型
                        imageUrl: item.imageUrl, // 更新為選中的圖片
                      }));
                    }}
                  >
                    <Avatar
                      source={item.imageUrl}
                      containerStyle={[
                        styles.optionImage,
                        item.imageUrl === parseInt(headShot.imageUrl as string)
                          ? styles.selected
                          : null,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </TabView.Item>
          ))}
        </TabView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tab: {
    // flexDirection: "row",
    // justifyContent: "center",
    // padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: "#E5E5E5",
    flex: 1,
    backgroundColor: "#fff",
  },
  tabButton: {
    marginHorizontal: 20,
    alignItems: "center",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  option: {
    width: 70,
    height: 70,
    margin: 2,
  },
  optionImage: {
    width: "90%",
    height: "90%",
  },
  selected: {
    marginHorizontal: 5,
    borderRadius: 50,
    borderWidth: 5, // 增加邊框寬度
    borderColor: "#2df1ff", // 改變邊框顏色
  },
});
export default AllHeadShot;
