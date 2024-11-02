import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import ShowHeadShot from "../editHeadShot/ShowHeadShot";
import { HeadShot as HeadShotType, User } from "../../shared/types";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
interface HeadShotProps {
  nameValue?: string;
  navigation: NavigationProp<any>;
  headShot: HeadShotType;
}

const HeadShot: React.FC<HeadShotProps> = ({
  nameValue,
  navigation,
  headShot,
}) => {
  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("editHeadShot")}
      >
        <ShowHeadShot imageUrl={headShot?.imageUrl} />
      </TouchableOpacity>

      {/* 名稱 */}
      {nameValue && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("editPersonal", {
              label: "名稱",
              defaultValue: nameValue,
              name: "name",
            });
          }}
        >
          <Text style={styles.label}>{nameValue}</Text>
        </TouchableOpacity>
      )}
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
