import React from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
import { HeadShot } from "../../shared/types";
import ShowHeadShot from "./ShowHeadShot";

interface SelectedHeadShotProps {
  headShot: HeadShot;
}

//  編輯大頭貼 上面已選的 大頭貼
const SelectedHeadShot: React.FC<SelectedHeadShotProps> = ({ headShot }) => {
  return (
    <View style={styles.avatarContainer}>
      <View style={[styles.avatar]}>
        <ShowHeadShot imageUrl={headShot?.imageUrl as ImageSourcePropType} />
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
});

export default SelectedHeadShot;
