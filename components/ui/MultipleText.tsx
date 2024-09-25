import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BorderButton from "./BorderButton";
import { useNavigation } from "@react-navigation/native";
import ViewBorderButton from "./ViewBorderButton";

interface MultipleTextProps {
  label: string;
  dataList: string[];
}

const MultipleText: React.FC<MultipleTextProps> = ({ label, dataList }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.TextContainer}
      onPress={() => navigation.navigate("aboutMeSelectOption")}
    >
      <Text style={styles.label}>{label}：</Text>
      {/* <TouchableOpacity style={styles.TextContainer}> */}
      {dataList.map((item, index) => {
        return <ViewBorderButton text={item} key={index} />;
      })}
      {/* </TouchableOpacity> */}
    </TouchableOpacity>
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
