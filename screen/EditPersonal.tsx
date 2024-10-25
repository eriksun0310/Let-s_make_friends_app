import { View, StyleSheet, Button, Alert } from "react-native";
import Input from "../components/ui/Input";
import { useEffect, useState } from "react";
import { editUserData } from "../util/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { RootState } from "../store/store";
import { NavigationProp } from "@react-navigation/native";

interface EditPersonalProps {
  route: {
    params: {
      label: string;
      defaultValue: string;
      name: string;
    };
  };
  navigation: NavigationProp<any>;
}
const EditPersonal: React.FC<EditPersonalProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { label, defaultValue, name } = route.params;

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
      dispatch(setUser({ ...user, [name]: value }));
      // 更新firebase
      await editUserData({
        userId: user.userId,
        fieldName: name,
        fieldValue: value,
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: `編輯${label}`,
      headerRight: () => <Button title="儲存" onPress={handleSave} />,
    });
  }, [navigation, value]);

  return (
    <View style={styles.screen}>
      <Input
        style={{
          borderWidth: 3,
          width: "90%",
        }}
        multiline={label === "自我介紹"}
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

export default EditPersonal;
