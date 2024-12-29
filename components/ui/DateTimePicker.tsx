import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";


interface CustomDateTimePickerProps {
  value: Date | null;
  onChange: (event: any, selectedDate: Date) => void;
}
const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <DateTimePicker
      value={value || new Date()} // 如果沒有選擇生日，預設為當前日期
      mode="date"
      display="default"
      onChange={(event, selectedDate) => onChange(event, selectedDate as Date)} // 當選擇日期時觸發
      maximumDate={new Date()} // 最大日期為今天，防止選擇未來的日期
    />
  );
};

export default CustomDateTimePicker;
