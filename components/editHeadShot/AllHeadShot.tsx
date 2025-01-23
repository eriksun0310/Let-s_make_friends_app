import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../../constants/style";
import { HeadShot, ImageType } from "../../shared/types";
import { Avatar, Tab, TabView } from "@rneui/themed";
import { headShotTabsTitle } from "../../shared/static";
import { imageUrls } from "../../shared/images";

interface AllHeadShotProps {
  headShot: HeadShot;
  setHeadShot: React.Dispatch<React.SetStateAction<HeadShot>>;
}
const AllHeadShot: React.FC<AllHeadShotProps> = ({ headShot, setHeadShot }) => {
  const [index, setIndex] = useState(0);

  // 初始化時設置 index
  useEffect(() => {
    const initialIndex = Object.keys(imageUrls).indexOf(headShot.imageType);
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
          onChange={setIndex}
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
          containerStyle={{
            marginTop: 16,
          }}
          value={index}
          onChange={setIndex}
          animationType="timing"
        >
          {Object.keys(imageUrls).map((key) => (
            <TabView.Item key={key}>
              <ScrollView>
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
                          item.imageUrl ===
                          parseInt(headShot.imageUrl as string)
                            ? styles.selected
                            : null,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </TabView.Item>
          ))}
        </TabView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    backgroundColor: "#fff",
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
