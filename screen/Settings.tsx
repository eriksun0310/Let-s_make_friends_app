import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { Colors } from "../constants/style";
import CustomSwitch from "../components/ui/button/CustomSwitch";
import BackButton from "../components/ui/button/BackButton";
import { saveUserSettings } from "../util/handleUserEvent";
import {
  selectUser,
  useAppDispatch,
  useAppSelector,
  setUserSettings as setUserSettingsRedux,
  selectUserSettings,
} from "../store";
import { NavigationProp } from "@react-navigation/native";
import { UserSettings } from "../shared/types";
import { initUserSettings } from "../shared/static";

interface SettingsProps {
  navigation: NavigationProp<any, any>;
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const userSettingsDefault = useAppSelector(selectUserSettings);

  // 儲存當前設定值
  const [userSettings, setUserSettings] =
    useState<UserSettings>(userSettingsDefault);

  // 儲存初始值
  const [initialUserSettings, setInitialUserSettings] =
    useState<UserSettings>(userSettingsDefault);

  const handleBackPress = async (currentUserSettings: UserSettings) => {
    // 比對初始值和當前值
    if (
      JSON.stringify(initialUserSettings) === JSON.stringify(currentUserSettings)
    ) {
      console.log('沒有改變');
      // 沒有改變，直接返回
      navigation.goBack();
      return;
    }


    console.log('有改變');
    // 如果有改變，更新到資料庫
    const success = await saveUserSettings({
      ...currentUserSettings,
      userId: personal.userId,
    });

    if (success) {
      // 更新redux userSettings
      dispatch(setUserSettingsRedux(currentUserSettings));
      navigation.goBack();
    }
  };

  const handleSwitchChange = ({
    name,
    value,
  }: {
    name: string;
    value: boolean;
  }) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "隱私設定",
      headerTitleAlign: "center",
      gestureEnabled: false, // 禁用手勢返回
      headerLeft: () => (
        <BackButton onPress={() => handleBackPress(userSettings)} />
      ),
    });
  }, [navigation, userSettings]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackPress(userSettings); // 避免資料遺失(user 進行設定修改,在返回鍵點擊時,會導致資料遺失)
        return true; // 攔截返回按鈕
      }
    );

    return () => backHandler.remove();
  }, []);

  // 設定預設值
  useEffect(() => {
    setUserSettings(userSettingsDefault);
    setInitialUserSettings(userSettingsDefault);
  }, [userSettingsDefault]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 15 }}></View>
      <CustomSwitch
        label="聊天室已讀標記"
        value={userSettings.markAsRead}
        onChange={(v) => {
          console.log("v", v);
          handleSwitchChange({
            name: "markAsRead",
            value: v,
          });
        }}
      />
      <CustomSwitch
        label="貼文隱藏按讚"
        value={userSettings.hideLikes}
        onChange={(v) => {
          handleSwitchChange({
            name: "hideLikes",
            value: v,
          });
        }}
      />
      <CustomSwitch
        label="貼文隱藏留言"
        value={userSettings.hideComments}
        onChange={(v) => {
          handleSwitchChange({
            name: "hideComments",
            value: v,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
export default Settings;
