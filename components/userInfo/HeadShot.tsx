import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import ShowHeadShot from "../editHeadShot/ShowHeadShot";
import { HeadShot as HeadShotType } from "../../shared/types";

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
            navigation.navigate("editUserInfo", {
              mode: "name",
              defaultValue: nameValue,
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
  option: {
    width: 150,
    height: 150,
  },
});

export default HeadShot;
