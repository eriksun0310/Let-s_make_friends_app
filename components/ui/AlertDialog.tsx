import React from "react";
import { View, Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import { Dialog, Button } from "@rneui/themed";

interface AlertDialogProps {
  isVisible: boolean; // 是否要開啟警告視窗
  alertTitle: string; // 警告視窗標題
  leftBtnText: string; // 左側按鈕文字
  rightBtnText: string; // 右側按鈕文字
  leftBtnOnPress: () => void; // 左側按鈕點擊事件
  rightBtnOnPress: () => void; // 右側按鈕點擊事件
  onBackdropPress: () => void; // 背景點擊事件
  rightButtonStyle?: StyleProp<TextStyle>; // 右側按鈕樣式
  rightTitleStyle?: StyleProp<TextStyle>; // 右側按鈕文字樣式
}
const AlertDialog: React.FC<AlertDialogProps> = ({
  isVisible,
  alertTitle,
  leftBtnText,
  rightBtnText,
  leftBtnOnPress,
  rightBtnOnPress,
  onBackdropPress,
  rightButtonStyle,
  rightTitleStyle,
}) => {
  return (
    <>
      <Dialog isVisible={isVisible} onBackdropPress={onBackdropPress}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          {alertTitle}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={leftBtnText}
            onPress={leftBtnOnPress}
            buttonStyle={[styles.leftButton, { backgroundColor: "#e6e6e6" }]}
            titleStyle={{ color: "#474747" }}
            // buttonStyle={[styles.leftButton, { backgroundColor: "#ffcccc" }]}
            // titleStyle={{ color: "#d9534f" }}
          />
          <Button
            title={rightBtnText}
            onPress={rightBtnOnPress}
            buttonStyle={[styles.rightButton, rightButtonStyle]}
            titleStyle={[styles.rightText, rightTitleStyle]}
          />
        </View>
      </Dialog>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  leftButton: {
    backgroundColor: "#ffcccc",
    borderRadius: 5,
    paddingVertical: 10,
  },

  rightButton: {
    backgroundColor: "#e1f5fe",
    borderRadius: 5,
    paddingVertical: 10,
  },
  rightText: {
    color: "#0277bd",
  },
});

export default AlertDialog;
