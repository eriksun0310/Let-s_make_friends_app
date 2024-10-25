import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";
import { Colors } from "../../constants/style";
interface TextLabelProps {
  isEdit?: boolean;
  label: string;
  value: string | number;
  name?: string;
}
const TextLabel: React.FC<TextLabelProps> = ({
  isEdit = false,
  label,
  value,
  name,
}) => {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    if (isEdit) {
      navigation.navigate("editPersonal", {
        label,
        defaultValue: value,
        name,
      });
    } else {
      setVisible(true);
    }
  };
  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.label}>
          {label}：{value}
        </Text>
      </TouchableOpacity>

      <Snackbar
        style={{
          position: "relative",
          zIndex: 9999,
          backgroundColor: Colors.snackbar,
          width: 300,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={1000}
        // action={{
        //   // label: "X",
        //   textColor:'#fff',
        //   // onPress: () => setVisible(false),
        // }}
      >
        {`${label} 這個項目不能修改!`}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
});

export default TextLabel;
