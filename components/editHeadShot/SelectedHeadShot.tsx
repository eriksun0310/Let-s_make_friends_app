import React from "react";
import { View, StyleSheet, Image } from "react-native";

interface SelectedHeadShotProps {
  imageUrl: string;
}

//  編輯大頭貼 上面已選的 大頭貼
const SelectedHeadShot: React.FC<SelectedHeadShotProps> = ({ imageUrl }) => {
  return (
    <View style={styles.avatarContainer}>
      <View style={[styles.avatar]}>
        <Image
          source={imageUrl as any}
          style={styles.optionImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 200,
    height: 200,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
});

export default SelectedHeadShot;
