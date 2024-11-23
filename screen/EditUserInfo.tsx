import { View, StyleSheet, Alert } from "react-native";
import Input from "../components/ui/Input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { RootState } from "../store/store";
import { NavigationProp } from "@react-navigation/native";
import SaveButton from "../components/ui/button/SaveButton";
import { updateUser } from "../util/person";
import { updateUserTitle } from "../shared/static";

interface EditUserInfoProps {
  route: {
    params: {
      mode: "introduce" | "name";
      defaultValue: string;
      // name: string;
    };
  };
  navigation: NavigationProp<any>;
}

// 編輯個人資料
const EditUserInfo: React.FC<EditUserInfoProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
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
      dispatch(setUser({ ...user, [mode]: value }));
      // 更新supabase
      await updateUser({
        userId: user.userId,
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
