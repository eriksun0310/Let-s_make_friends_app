import { View, StyleSheet, ImageSourcePropType } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Avatar } from "@rneui/themed";

const ShowHeadShot = ({ imageUrl }: { imageUrl: ImageSourcePropType }) => {
  return (
    <>
      {imageUrl ? (
        <Avatar source={imageUrl} containerStyle={styles.optionImage} />
      ) : (
        <View style={styles.defaultCircle}>
          <Feather name="user" size={54} color="black" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  defaultCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 100, // 使其成为圆形
    backgroundColor: "#e5e5e5", // 圆形的背景颜色
    alignItems: "center", // 垂直居中图标
    justifyContent: "center", // 水平居中图标
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
});

export default ShowHeadShot;
