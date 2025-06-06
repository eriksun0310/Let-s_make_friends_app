import { View, StyleSheet, Alert } from "react-native";
import Input from "../components/ui/Input";
import { useEffect, useState } from "react";
import { selectUser, setUser } from "../store/userSlice";
import { NavigationProp } from "@react-navigation/native";
import SaveButton from "../components/ui/button/SaveButton";
import { updateUserField } from "../util/handleUserEvent";
import { updateUserTitle } from "../shared/static";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface EditUserInfoProps {
  route: {
    params: {
      mode: "introduce" | "name";
      defaultValue: string;
    };
  };
  navigation: NavigationProp<any>;
}

// 編輯個人資料
const EditUserInfo: React.FC<EditUserInfoProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);

  const { mode, defaultValue } = route.params;

  const [value, setValue] = useState("");

  //處理預設值
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSave = async () => {
    // 請填寫
    if (!value) {
      Alert.alert("請填寫空白處");
    } else {
      // 更新回redux
      dispatch(setUser({ ...personal, [mode]: value }));
      // 更新supabase
      await updateUserField({
        userId: personal.userId,
        fieldName: mode,
        fieldValue: value,
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: `編輯${updateUserTitle[mode]}`,
      headerTitleAlign: "center",
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [navigation, value]);

  return (
    <View style={styles.screen}>
      <Input
        style={{
          borderWidth: 3,
          width: "90%",
        }}
        multiline={mode === "introduce"}
        value={value}
        setValue={(v) => {
          setValue(v);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
  },
});

export default EditUserInfo;
