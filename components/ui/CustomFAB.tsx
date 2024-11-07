import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FAB, Portal } from "react-native-paper";
import { Colors } from "../../constants/style";

const CustomFAB = ({ navigation }) => {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  return (
    <Portal>
      <FAB.Group
        open={open}
        visible
        icon={open ? "chevron-down" : "chevron-up"}
        fabStyle={{
          backgroundColor: "#ffffff", // 設定主按鈕背景色
        }}
        color={Colors.iconBlue}
        actions={[
          {
            icon: "pencil",
            label: "新增文章",
            onPress: () => navigation.navigate("addPost"),
            color: Colors.iconBlue,
            style: {
              backgroundColor: "#ffffff",
            },
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};

export default CustomFAB;
