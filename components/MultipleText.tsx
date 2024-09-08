import React from "react";
import { View, Text, StyleSheet } from "react-native";

import BorderButton from "./BorderButton";

//
const dataList = ["看劇", "看電影"];

interface MultipleTextProps {
  label: string;
  dataList: string[];
}

const MultipleText: React.FC<MultipleTextProps> = ({ label, dataList }) => {
  return (
    <View style={styles.TextContainer}>
      <Text style={styles.label}>{label}：</Text>
      {dataList.map((item, index) => {
        return <BorderButton text={item} key={index} />;
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  TextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
});

export default MultipleText;
