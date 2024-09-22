import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";

type Type = "people" | "animal";

export const imageUrls = {
  people: [
    { imageUrl: require("../../assets/people/man/man.png") },
    { imageUrl: require("../../assets/people/man/man (1).png") },
    { imageUrl: require("../../assets/people/man/man (2).png") },
    { imageUrl: require("../../assets/people/woman/girl.png") },
    { imageUrl: require("../../assets/people/woman/woman (1).png") },
    { imageUrl: require("../../assets/people/woman/woman (2).png") },
    { imageUrl: require("../../assets/people/woman/woman (3).png") },
  ],
  animal: [{ imageUrl: require("../../assets/animal/ostrich.png") }],
};

interface SelectedHeadShotProps {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const AllHeadShot: React.FC<SelectedHeadShotProps> = ({
  imageUrl,
  setImageUrl,
}) => {
  const [type, setType] = useState<Type>("people");

  return (
    <>
      {/* tab */}
      <View style={styles.tab}>
        {Object.keys(imageUrls)?.map((key) => {
          return (
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setType(key as Type)}
            >
              <Text
                style={{
                  color: type === key ? "#3D74DB" : "#000",
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
          {imageUrls[type].map((item) => (
            <TouchableOpacity
              key={item.imageUrl}
              style={styles.option}
              onPress={() => setImageUrl(item.imageUrl)}
            >
              <Image
                source={item.imageUrl}
                style={[
                  styles.optionImage,
                  item.imageUrl === imageUrl ? styles.selected : null,
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
    width: 90,
    height: 90,
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
