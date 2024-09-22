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
import SelectedHeadShot from "../components/editHeadShot/SelectedHeadShot";
import AllHeadShot from "../components/editHeadShot/AllHeadShot";

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

const EditHeadShot: React.FC<AvatarCreatorProps> = ({ gender = "man" }) => {
  const [imageUrl, setImageUrl] = useState<string>(
    peopleImages[gender][0].imageUrl
  );

  return (
    <View style={styles.container}>
      <SelectedHeadShot imageUrl={imageUrl} />
      <AllHeadShot gender={gender} setImageUrl={setImageUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default EditHeadShot;
