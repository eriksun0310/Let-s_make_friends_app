import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { Colors } from "../constants/style";
import CustomSwitch from "../components/ui/button/CustomSwitch";
import BackButton from "../components/ui/button/BackButton";
import { getUserSettings, saveUserSettings } from "../util/handleUserEvent";
import { selectUser, useAppSelector } from "../store";
import { NavigationProp } from "@react-navigation/native";

interface SettingsProps {
  navigation: NavigationProp<any, any>;
}

interface UserSettings {
  hideLikes: boolean;
  hideComments: boolean;
  markAsRead: boolean;
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const personal = useAppSelector(selectUser);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    hideLikes: false,
    hideComments: false,
    markAsRead: false,
  });

  const handleBackPress = async (currentUserSettings: UserSettings) => {
    console.log("currentUserSettings 11111", currentUserSettings);
    // 在這裡保存資料到 user_setting
    const success = await saveUserSettings({
      ...currentUserSettings,
      userId: personal.userId,
    });

    if (success) {
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
    const fetchUserSettings = async () => {
      const userSettings = await getUserSettings({ userId: personal.userId });

      if (userSettings.success) {
        const { hideLikes, hideComments, markAsRead } = userSettings;

        setUserSettings({
          hideLikes: hideLikes,
          hideComments: hideComments,
          markAsRead: markAsRead,
        });
      }
    };

    fetchUserSettings();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // TODO: 明天用安卓模擬器試看看這個要不要
        //handleBackPress();
        return true; // 攔截返回按鈕
      }
    );

    return () => backHandler.remove();
  }, []);

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
