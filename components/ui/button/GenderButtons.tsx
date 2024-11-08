import React, { useEffect, useState } from "react";
import { ButtonGroup } from "@rneui/themed";

import { Text, StyleSheet } from "react-native";
import { Gender } from "../../../shared/types";
import { gender } from "../../../shared/static";
import { Colors } from "../../../constants/style";

interface GenderButtonsProps {
  value: Gender;
  getValue: (v: Gender) => void;
}

const GenderButtons: React.FC<GenderButtonsProps> = ({ value, getValue }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    getValue(Object.keys(gender)[selectedIndex] as Gender);
  }, [selectedIndex]);

  useEffect(() => {
    const index = Object.keys(gender).indexOf(value);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, []);

  return (
    <>
      <Text style={styles.label}>性別：</Text>
      <ButtonGroup
        buttons={[gender.female, gender.male]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        selectedButtonStyle={{ backgroundColor: Colors.button }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 8,
  },
  requiredNone: {
    opacity: 0,
    color: "red",
    marginRight: 4, // 與標籤間距
  },
});
export default GenderButtons;
