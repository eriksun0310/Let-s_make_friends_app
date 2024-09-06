import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XIcon } from "lucide-react-native";

type Type = "people" | "animal";

interface ImageType {
  imageUrl: any; // Change to any to allow require() for local images
}
interface AvatarCreatorProps {
  gender?: "man" | "woman";
}

const animalImages: ImageType[] = [
  { imageUrl: require("../assets/animal/ostrich.png") },
];

const peopleImages = {
  man: [
    { imageUrl: require("../assets/people/man/man.png") },
    { imageUrl: require("../assets/people/man/man (1).png") },
    { imageUrl: require("../assets/people/man/man (2).png") },
  ],
  woman: [
    { imageUrl: require("../assets/people/woman/girl.png") },
    { imageUrl: require("../assets/people/woman/woman (1).png") },
    { imageUrl: require("../assets/people/woman/woman (2).png") },
    { imageUrl: require("../assets/people/woman/woman (3).png") },
  ],
};

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ gender = "man" }) => {
  const [type, setType] = useState<Type>("people");
  const [image, setImage] = useState<string>(peopleImages[gender][0].imageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <XIcon size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>儲存</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <View style={[styles.avatar]}>
          <Image
            source={image as any}
            style={styles.optionImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
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
          style={styles.footerButton}
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
              onPress={() => setImage(item.imageUrl)}
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
              onPress={() => setImage(item.imageUrl)}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  saveButton: {
    backgroundColor: "#3D74DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  hairStyle: {
    width: "100%",
    height: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  footerButton: {
    marginHorizontal: 20,
    alignItems: "center",
  },
  optionsContainer: {
    padding: 16,
  },
  option: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
});

export default AvatarCreator;
