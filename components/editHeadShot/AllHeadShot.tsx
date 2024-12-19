import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
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

export const imageUrls = {
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
  return (
    <>
      {/* tab */}
      <View style={styles.tab}>
        {Object.keys(imageUrls)?.map((key) => {
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabButton}
              onPress={() => {
                setHeadShot((prev) => ({
                  ...prev,
                  imageType: key as ImageType,
                }));
              }}
            >
              <Text
                style={{
                  color:
                    headShot.imageType === key ? Colors.textBlue : Colors.text,
                }}
              >
                {key === "people" ? "人像" : "動物"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 大頭貼選項 */}
      <ScrollView>
        <View style={styles.optionsContainer}>
          {imageUrls[headShot.imageType].map((item) => (
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
              <Image
                source={item.imageUrl}
                style={[
                  styles.optionImage,
                  item.imageUrl === headShot.imageUrl ? styles.selected : null,
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
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
    width: 80,
    height: 80,
    margin: 8,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
  selected: {
    marginHorizontal: 5,

    borderRadius: 50,
    borderWidth: 8, // 增加邊框寬度
    borderColor: "#2df1ff", // 改變邊框顏色
  },
});
export default AllHeadShot;
