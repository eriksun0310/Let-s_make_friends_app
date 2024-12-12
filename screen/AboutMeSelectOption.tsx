import { View, StyleSheet } from "react-native";
import { Tab, TabView } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";
import { SelectedOption } from "../shared/types";
import { Tab as TabType } from "../shared/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { selectUser, setUser } from "../store/userSlice";
import SaveButton from "../components/ui/button/SaveButton";
import BackButton from "../components/ui/button/BackButton";
import { saveUserSelectedOption } from "../util/handlePersonEvent";
import { tabs } from "../shared/static";
import { Screen } from "../shared/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";

type RootStackParamList = {
  aboutMe: undefined;
  AboutMeSelectOption: { currentTab: string; screen: Screen };
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
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const { currentTab, screen } = route.params;

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

    // 判斷哪個畫面需要打api
    if (screen === "userInfo") {
      await saveUserSelectedOption({
        user: {
          ...user,
          selectedOption,
        },
      });
    }

    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: "更多關於我的設定",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
      headerRight: () => <SaveButton onPress={handleSave} />,
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
