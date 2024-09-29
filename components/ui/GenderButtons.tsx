import React, { useEffect, useState } from "react";
import { ButtonGroup } from "@rneui/themed";
import { Text, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/style";

const gender = {
  female: "女",
  male: "男",
};
const GenderButtons = ({ value = "male", getValue }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    getValue(Object.keys(gender)[selectedIndex]);
  }, [selectedIndex]);

  useEffect(() => {
    const index = Object.keys(gender).indexOf(value);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [value]);
  return (
    <ButtonGroup
      buttons={[gender.female, gender.male]}
      selectedIndex={selectedIndex}
      onPress={(value) => {
        setSelectedIndex(value);
      }}
      selectedButtonStyle={{ backgroundColor: Colors.button }}
    />
  );
};

export default GenderButtons;
