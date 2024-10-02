import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import ShowHeadShot from "../editHeadShot/ShowHeadShot";
import { HeadShot as HeadShotType } from "../../shared/types";
interface HeadShotProps {
  name?: string;
  navigation: NavigationProp<any>;
  headShot: HeadShotType;
  setHeadShot: (v: HeadShotType) => void;
}

const HeadShot: React.FC<HeadShotProps> = ({
  name,
  navigation,
  headShot,
  setHeadShot,
}) => {
  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          navigation.navigate("editHeadShot", {
            defaultHeadShot: headShot,
            //步骤 3.onSave 函数在 HeadShot 页面中执行，接收 newHeadShot 并更新form状态
            onSave: (newHeadShot: HeadShotType) => {
              console.log("newHeadShot", newHeadShot);
              setHeadShot(newHeadShot);
            },
          })
        }
      >
        <ShowHeadShot imageUrl={headShot?.imageUrl} />
      </TouchableOpacity>

      {/* 名稱 */}
      {name && <Text style={styles.label}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  defaultCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 100, // 使其成为圆形
    backgroundColor: "#e5e5e5", // 圆形的背景颜色
    alignItems: "center", // 垂直居中图标
    justifyContent: "center", // 水平居中图标
  },
  option: {
    width: 150,
    height: 150,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
});

export default HeadShot;
