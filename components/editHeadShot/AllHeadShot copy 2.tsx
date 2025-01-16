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

  console.log("headShot", headShot);


  useEffect(()=>{
    
  })
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
        <TabView value={index} onChange={setIndex} animationType="timing">
          <View style={styles.optionsContainer}>
            {imageUrls[headShot.imageType].map((item) => {
              console.log("item", item);
              return (
                <TouchableOpacity
                  key={item.imageUrl}
                  style={styles.option}
                  onPress={() => {
                    setHeadShot((prev) => ({
                      ...prev,
                      imageUrl: item.imageUrl,
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
              );
            })}
          </View>
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
