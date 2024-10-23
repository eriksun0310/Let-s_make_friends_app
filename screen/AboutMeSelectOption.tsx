import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Tab, TabView } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";
import { Tabs } from "../shared/types";
import { Tab as TabType } from "../shared/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
const tabs: Tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
};

// 假設這是從db拿
const userDB = {
  interests: ["reading"],
  favoriteFood: ["chocolate"],
};

type RootStackParamList = {
  aboutMe: undefined;
  AboutMeSelectOption: { currentTab: string };
  // 其他 screen 的定義...
};

type AboutMeSelectOptionRouteProp = RouteProp<
  RootStackParamList,
  "AboutMeSelectOption"
>;
type AboutMeSelectOptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AboutMeSelectOption"
>;
type AboutMeSelectOptionProps = {
  navigation: AboutMeSelectOptionNavigationProp;
  route: AboutMeSelectOptionRouteProp;
};

const AboutMeSelectOption: React.FC<AboutMeSelectOptionProps> = ({
  navigation,
  route,
}) => {
  const { currentTab } = route.params;

  const [index, setIndex] = useState(0);

  // 當前選的tab
  useEffect(() => {
    const index = Object.keys(tabs).indexOf(currentTab);
    if (index !== -1) {
      setIndex(index);
    }
  }, [currentTab]);

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
            key={key}
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
            {tabs[key as TabType]}
          </Tab.Item>
        ))}
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {Object.keys(tabs)?.map((key) => (
          <TabView.Item key={key}>
            <RenderOption currentTab={key as TabType} />
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
