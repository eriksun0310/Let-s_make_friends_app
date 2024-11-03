import React, { useState } from "react";
import { Menu } from "react-native-paper";
import { StyleSheet, TouchableOpacity } from "react-native";
import { EllipsisVertical } from "lucide-react-native";
import { Colors } from "../../constants/style";
const CustomMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = (event: any) => {
    setMenuVisible(true);
  };
  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <TouchableOpacity onPress={showMenu} style={styles.menuButton}>
          <EllipsisVertical color={Colors.icon} />
        </TouchableOpacity>
      }
      contentStyle={[styles.menuContent, { marginTop: -56 }]} // 調整選單位置
    >
      <Menu.Item
        onPress={() => {}}
        title="編輯"
        style={{
          marginHorizontal: 10,

          height: 30,
        }}
      />
      <Menu.Item
        onPress={() => {}}
        title="刪除"
        style={{
          marginHorizontal: 10,
        }}
        titleStyle={{ color: "#ff0000" }}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  menuContent: {
    backgroundColor: "#fff",
    elevation: 8,
    width: 90,
    height: 85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CustomMenu;
