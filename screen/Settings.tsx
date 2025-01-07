import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/style";
import CustomSwitch from "../components/ui/button/CustomSwitch";
const Settings = ({ navigation }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "設定",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomSwitch label="聊天室已讀標記"></CustomSwitch>
      <CustomSwitch label="貼文隱藏按讚"></CustomSwitch>
      <CustomSwitch label="貼文隱藏留言"></CustomSwitch>
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
