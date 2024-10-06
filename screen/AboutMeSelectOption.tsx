import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Tab, TabView } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";
import { OptionList, SelectedOption, Tabs } from "../shared/types";
import { useSelector } from "react-redux";

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

const AboutMeSelectOption = ({ navigation, route }) => {
  const userData = useSelector((state) => state.user.userData);
  
  const { currentTab,
    //  selectedOption, setSelectedOption
     } = route.params;

  const [index, setIndex] = useState(0);

  console.log("userData 22222", userData.selectedOption);

  const selectedOption =userData.selectedOption

  // const [selectedOption, setSelectedOption] = useState<SelectedOption>({});

  // useEffect(() => {
  //   navigation.setParams({
  //     selectedOption,
  //   });
  // }, [selectedOption]);

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
            <RenderOption
              currentTab={key}
              defaultValue={selectedOption[key]}
              selectedOption={selectedOption}
              // setSelectedOption={setSelectedOption}
            />
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
