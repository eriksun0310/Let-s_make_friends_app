import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BorderButton from "./BorderButton";
import { useNavigation } from "@react-navigation/native";
import ViewBorderButton from "./ViewBorderButton";
import { SelectedOption, Tab } from "../../shared/types";
import { Colors } from "../../constants/style";

interface MultipleTextProps {
  label: string;
  dataList: string[];
  currentTab: Tab;
}

const MultipleText: React.FC<MultipleTextProps> = ({
  label,
  currentTab,
  dataList,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.TextContainer}
      onPress={() =>
        navigation.navigate("aboutMeSelectOption", {
          currentTab: currentTab,
        })
      }
    >
      <Text style={styles.label}>{label}：</Text>

      {dataList?.length > 0 ? (
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {dataList?.map((item, index) => {
            return <ViewBorderButton text={item} key={index} />;
          })}
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("aboutMeSelectOption", {
              currentTab: currentTab,
            });
          }}
        >
          <Text style={[styles.label, { color: Colors.textBlue }]}>
            請選擇..
          </Text>
        </TouchableOpacity>
      )}
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
