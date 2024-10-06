import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import ShowHeadShot from "../editHeadShot/ShowHeadShot";
import { HeadShot as HeadShotType } from "../../shared/types";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/userSlice";
interface HeadShotProps {
  name?: string;
  navigation: NavigationProp<any>;
  headShot: HeadShotType;
}

const HeadShot: React.FC<HeadShotProps> = ({ name, navigation, headShot }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          navigation.navigate("editHeadShot", {
            //步骤 3.onSave 函数在 HeadShot 页面中执行，接收 newHeadShot 并更新form状态
            onSave: (newHeadShot: HeadShotType) => {
              dispatch(
                setUserData({
                  headShot: newHeadShot,
                })
              );
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
