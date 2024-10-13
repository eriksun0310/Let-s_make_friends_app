import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../../constants/style";
import Input from "./Input";

interface AgeCalculatorValue {
  birthDate: Date | null;
  age: number | null;
}

interface AgeCalculatorProps {
  defaultValue: string; // 格式 "2022-01-01"
  getValue: (v: AgeCalculatorValue) => void;
}

const AgeCalculator: React.FC<AgeCalculatorProps> = ({
  defaultValue,
  getValue,
}) => {
  //
  const initialDate = defaultValue ? new Date(defaultValue) : new Date();

  const [value, setValue] = useState<AgeCalculatorValue>({
    birthDate: initialDate,
    age: null,
  });

  // 計算年齡的函數
  const calculateAge = (date: Date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--; // 如果生日還沒到，年齡減一
    }

    // setAge(age);
    setValue((prev) => ({
      ...prev,
      age: age,
    }));
  };

  // 日期選擇處理
  const onChange = (event: any, selectedDate: Date) => {
    if (selectedDate) {
      setValue((prev) => ({
        ...prev,
        birthDate: selectedDate,
      }));

      // 設置生日
      calculateAge(selectedDate); // 計算年齡
    }
  };

  useEffect(() => {
    if (value.birthDate) {
      calculateAge(value.birthDate);
    }
  }, [value.birthDate]);

  useEffect(() => {

    if (value?.age !== null) {
      getValue(value);
    }
  }, [value]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={styles.label}>生日：</Text>

        <DateTimePicker
          value={value?.birthDate || new Date()} // 如果沒有選擇生日，預設為當前日期
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            onChange(event, selectedDate as Date)
          } // 當選擇日期時觸發
          maximumDate={new Date()} // 最大日期為今天，防止選擇未來的日期
        />
      </View>

      {value.age !== null && (
        <Input label="年齡" value={value.age?.toString()} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    width: 100,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 3,
    padding: 10,
    width: "70%",
    borderRadius: 8,
    borderColor: Colors.button,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default AgeCalculator;
