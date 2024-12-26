import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Colors } from "../../constants/style";
import Input from "./Input";
import { calculateAge } from "../../shared/userFuncs";
import CustomDateTimePicker from "./DateTimePicker";

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
  const initialDate = defaultValue ? new Date(defaultValue) : new Date();

  // 用來控制 android 上的 DateTimePicker 開關
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [value, setValue] = useState<AgeCalculatorValue>({
    birthDate: initialDate,
    age: null,
  });

  // 日期選擇處理
  const onChange = (event: any, selectedDate: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setValue((prev) => ({
        ...prev,
        birthDate: selectedDate,
      }));

      // 設置生日
      const age = calculateAge(selectedDate); // 計算年齡
      setValue((prev) => ({
        ...prev,
        age: age,
      }));
    }
  };

  useEffect(() => {
    if (value.birthDate) {
      const age = calculateAge(value.birthDate);
      setValue((prev) => ({
        ...prev,
        age: age,
      }));
    }
  }, [value.birthDate]);

  useEffect(() => {
    if (value?.age !== null) {
      getValue(value);
    }
  }, [value]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.required}>*</Text>
          <Text style={styles.label}>生日：</Text>
        </View>

        {Platform.OS === "android" ? (
          <TouchableOpacity
            style={{
              paddingLeft: 10,
              width: "100%",
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.input}>
              {value?.birthDate?.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ) : (
          <CustomDateTimePicker value={value?.birthDate} onChange={onChange} />
        )}

        {/* Android 平台的 DateTimePicker 顯示 */}
        {Platform.OS === "android" && showDatePicker && (
          <CustomDateTimePicker value={value?.birthDate} onChange={onChange} />
        )}
      </View>

      {value.age !== null && (
        <Input
          style={{
            width: "40%",
          }}
          label="年齡"
          value={value.age?.toString()}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    width: 100,
  },
  required: {
    color: "#f00", // 紅色
    marginRight: 4, // 與標籤間距
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 3,
    padding: 10,
    width: "40%",
    borderRadius: 8,
    borderColor: Colors.button,
  },
});

export default AgeCalculator;
