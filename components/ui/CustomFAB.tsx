import React, { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";
interface CustomFABProps {
  navigation: NavigationProp<any, any>;
}

const CustomFAB: React.FC<CustomFABProps> = ({ navigation }) => {
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
            onPress: () =>
              navigation.navigate("postContent", {
                mode: "add",
                editPost: null,
              }),
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
