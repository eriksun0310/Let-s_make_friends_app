import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SelectedHeadShot from "../components/editHeadShot/SelectedHeadShot";
import AllHeadShot, { imageUrls } from "../components/editHeadShot/AllHeadShot";

interface AvatarCreatorProps {}

const EditHeadShot: React.FC<AvatarCreatorProps> = () => {
  const [imageUrl, setImageUrl] = useState<string>(
    imageUrls["people"][0].imageUrl
  );

  return (
    <View style={styles.container}>
      <SelectedHeadShot imageUrl={imageUrl} />
      <AllHeadShot imageUrl={imageUrl} setImageUrl={setImageUrl} />
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
