import { View, StyleSheet, Button } from "react-native";
import { Tab, TabView } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";
import { SelectedOption, Tabs } from "../shared/types";
import { Tab as TabType } from "../shared/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { setUser } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { editUserData } from "../util/auth";
const tabs: Tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
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
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { currentTab } = route.params;

  const [selectedOption, setSelectedOption] = useState<SelectedOption>({});

  const [index, setIndex] = useState(0);

  // 點擊每個選項的事件
  const onPress = (v: string, currentTab: TabType) => {
    if (!selectedOption[currentTab]) {
      setSelectedOption((prev) => ({
        ...prev,
        [currentTab]: [v],
      }));

      // 已經存在 tab
    } else {
      const existingValues = selectedOption[currentTab];

      // 已經存在的選項,移除
      if (existingValues.includes(v)) {
        setSelectedOption((prev) => ({
          ...prev,
          [currentTab]: existingValues.filter((option) => option !== v),
        }));

        // 沒有存在的選項，新增
      } else {
        setSelectedOption((prev) => ({
          ...prev,
          [currentTab]: [...existingValues, v],
        }));
      }
    }
  };

  // 當前選的tab
  useEffect(() => {
    const index = Object.keys(tabs).indexOf(currentTab);
    if (index !== -1) {
      setIndex(index);
    }
  }, [currentTab]);

  const handleSave = async () => {
    // 更新回redux
    dispatch(setUser({ ...user, selectedOption }));
    // 更新firebase
    await editUserData({
      userId: user.userId,
      fieldName: "selectedOption",
      fieldValue: selectedOption,
    });
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: "更多關於我的設定",
      headerRight: () => <Button title="儲存" onPress={handleSave} />,
    });
  }, [navigation, selectedOption]);

  // 預設值
  useEffect(() => {
    setSelectedOption((prev) => ({
      ...prev,
      ...user.selectedOption,
    }));
  }, [user]);

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
            <RenderOption
              currentTab={key as TabType}
              selectedOption={selectedOption}
              onPress={onPress}
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
