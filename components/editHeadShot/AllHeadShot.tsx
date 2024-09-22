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
interface ImageType {
  imageUrl: any; // Change to any to allow require() for local images
}

const animalImages: ImageType[] = [
  { imageUrl: require("../../assets/animal/ostrich.png") },
];
const peopleImages = {
  man: [
    { imageUrl: require("../../assets/people/man/man.png") },
    { imageUrl: require("../../assets/people/man/man (1).png") },
    { imageUrl: require("../../assets/people/man/man (2).png") },
  ],
  woman: [
    { imageUrl: require("../../assets/people/woman/girl.png") },
    { imageUrl: require("../../assets/people/woman/woman (1).png") },
    { imageUrl: require("../../assets/people/woman/woman (2).png") },
    { imageUrl: require("../../assets/people/woman/woman (3).png") },
  ],
};

interface SelectedHeadShotProps {
  gender: "man" | "woman";
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const AllHeadShot: React.FC<SelectedHeadShotProps> = ({
  gender = "man",
  setImageUrl,
}) => {
  const [type, setType] = useState<Type>("people");

  return (
    <>
      <View style={styles.tab}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setType("people")}
        >
          <Text
            style={{
              color: type === "people" ? "#3D74DB" : "#000",
            }}
          >
            人像
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setType("animal")}
        >
          <Text
            style={{
              color: type === "animal" ? "#3D74DB" : "#000",
            }}
          >
            動物
          </Text>
        </TouchableOpacity>
      </View>

      {type === "people" && (
        <ScrollView horizontal style={styles.optionsContainer}>
          {peopleImages[gender].map((item) => (
            <TouchableOpacity
              key={item.imageUrl}
              style={styles.option}
              onPress={() => setImageUrl(item.imageUrl)}
            >
              <Image
                source={item.imageUrl}
                style={styles.optionImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {type === "animal" && (
        <ScrollView horizontal style={styles.optionsContainer}>
          {animalImages.map((item) => (
            <TouchableOpacity
              key={item.imageUrl}
              style={styles.option}
              onPress={() => setImageUrl(item.imageUrl)}
            >
              <Image
                source={item.imageUrl}
                style={styles.optionImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    padding: 16,
  },
  option: {
    width: 80,
    height: 80,

    marginHorizontal: 8,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
});
export default AllHeadShot;
