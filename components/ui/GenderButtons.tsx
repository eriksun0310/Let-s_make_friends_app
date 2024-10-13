import React, { useEffect, useState } from "react";
import { ButtonGroup } from "@rneui/themed";
import { Colors } from "../../constants/style";
import { Gender } from "../../shared/types";
import { gender } from "../../shared/static";



interface GenderButtonsProps {
  value: Gender;
  getValue: (v: Gender) => void;
}

const GenderButtons: React.FC<GenderButtonsProps> = ({
  value,
  getValue,
}) => {
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
