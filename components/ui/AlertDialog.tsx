import React from "react";
import { View, Text } from "react-native";
import { Dialog, Button } from "@rneui/themed";

interface AlertDialogProps {
  label: string;
  isVisible: boolean; // 是否要開啟警告視窗
  onCloseAlert: () => void; // 關閉警告視窗
  onClosePost: () => void; // 關閉 新增文章
}
const AlertDialog: React.FC<AlertDialogProps> = ({
  label,
  isVisible,
  onCloseAlert,
  onClosePost,
}) => {
  return (
    <View>
      <Dialog isVisible={isVisible} onBackdropPress={onCloseAlert}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          如果現在捨棄，系統將不會儲存這則{label}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {/* <Dialog.Actions> */}
          <Button
            title={`捨棄${label}`}
            onPress={onClosePost}
            buttonStyle={{
              backgroundColor: "#ffcccc",
              borderRadius: 5,
              paddingVertical: 10,
            }}
            titleStyle={{ color: "#d9534f" }}
          />
          <Button
            title="繼續編輯"
            onPress={onCloseAlert}
            buttonStyle={{
              // flex: 1,
              backgroundColor: "#e1f5fe",
              borderRadius: 5,
              paddingVertical: 10,
            }}
            titleStyle={{ color: "#0277bd" }}
          />
          {/* </Dialog.Actions> */}
        </View>
      </Dialog>
    </View>
  );
};

export default AlertDialog;
