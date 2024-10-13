import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ViewBorderButton from "./ViewBorderButton";
import { Tab } from "../../shared/types";
import { Colors } from "../../constants/style";
import { optionList, tabs } from "../../shared/static";

interface MultipleTextProps {

  dataList: string[];
  currentTab: Tab;
}

const MultipleText: React.FC<MultipleTextProps> = ({
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
      <Text style={styles.label}>{tabs[currentTab as Tab]}：</Text>

      {dataList?.length > 0 ? (
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {dataList?.map((item, index) => {
          
            const option = optionList?.[currentTab]?.[item];
            return <ViewBorderButton text={option} key={index} />;
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
