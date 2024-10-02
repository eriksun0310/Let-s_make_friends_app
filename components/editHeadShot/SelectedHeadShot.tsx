import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { HeadShot } from "../../shared/types";
import ShowHeadShot from "./ShowHeadShot";

interface SelectedHeadShotProps {
  headShot: HeadShot;
}

//  編輯大頭貼 上面已選的 大頭貼
const SelectedHeadShot: React.FC<SelectedHeadShotProps> = ({ headShot }) => {
  // console.log("headShot", headShot);
  return (
    <View style={styles.avatarContainer}>
      <View style={[styles.avatar]}>
        <ShowHeadShot imageUrl={headShot?.imageUrl} />
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
