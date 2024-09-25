import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Tab, TabView } from "@rneui/themed";
import { useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";

const tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
};
const AboutMeSelectOption = () => {
  const [index, setIndex] = useState(0);

  console.log("index", index);
  return (
    <View style={styles.screen}>
      <Tab
        value={index}
        onChange={setIndex}
        dense
        indicatorStyle={{
          backgroundColor: Colors.textBlue,
          height: 3,
        }}
      >
        {Object.keys(tabs)?.map((key) => (
          <Tab.Item
            titleStyle={(active) =>
              active
                ? {
                    color: Colors.textBlue,
                  }
                : {
                    color: Colors.text,
                  }
            }
          >
            {tabs[key]}
          </Tab.Item>
        ))}
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {Object.keys(tabs)?.map((key) => (
          <TabView.Item>
            {/* <Text>{tabs[key]}</Text> */}
            <RenderOption currentTab={key} />
          </TabView.Item>
        ))}
      </TabView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default AboutMeSelectOption;
