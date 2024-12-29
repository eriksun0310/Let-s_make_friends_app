import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Colors } from "../constants/style";
import HeadShot from "../components/userInfo/HeadShot";
import Input from "../components/ui/Input";
import AgeCalculator from "../components/ui/AgeCalculator";
import { Gender, HeadShot as HeadShotType, User } from "../shared/types";
import SelectedOption from "../components/aboutMe/SelectedOption";
import { selectUser, setUser } from "../store/userSlice";
import { useEffect, useState } from "react";
import { checkRequired } from "../shared/user/userFuncs";
import { NavigationProp } from "@react-navigation/native";
import GenderButtons from "../components/ui/button/GenderButtons";
import SaveButton from "../components/ui/button/SaveButton";
import { saveAboutMe } from "../util/handleUserEvent";
import { userInit } from "../shared/static";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface AboutMeProps {
  navigation: NavigationProp<any>;
}

const AboutMe: React.FC<AboutMeProps> = ({ navigation }) => {
  const personal = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<User>(userInit);

  //更新form state
  const handleChange = (
    name: string,
    value: string | Date | number | Gender | HeadShotType
  ) => {
    if (name === "birthday") {
      const year = (value as Date)?.getFullYear();
      const month = String((value as Date)?.getMonth() + 1).padStart(2, "0"); // 月份從0開始，所以要加1
      const day = String((value as Date)?.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      setForm((prev) => ({
        ...prev,
        birthday: formattedDate,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 點下 關於我 的儲存 事件
  const handleSave = async () => {
    const required = checkRequired(form);
    if (required.isRequired) {
      dispatch(
        setUser({
          ...form,
        })
      ); // 更新redux
      await saveAboutMe({
        user: form,
      });
      navigation.navigate("main", { screen: "chatRoomList" });
    } else {
      Alert.alert(required.requiredText);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [navigation, form]);

  useEffect(() => {
    if (personal) {
      setForm((prev) => ({
        ...prev,
        userId: personal.userId,
        email: personal.email,
        selectedOption: personal.selectedOption,
        headShot: personal.headShot,
      }));
    }
  }, [personal]);

  // useEffect(()=>{
  //   const aa = async () => {
  //     await createNewUser({ userId: userId, email: email });
  //   }

  // }, [])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot
          userState="personal"
          screen="aboutMe"
          navigation={navigation}
          headShot={form.headShot}
        />

        {/* 性別 */}
        <View style={styles.formContainer}>
          <Input
            maxLength={10}
            required
            label="名稱"
            value={form.name}
            setValue={(v) => handleChange("name", v)}
          />
          <Input
            multiline
            label="自我介紹"
            value={form.introduce}
            setValue={(v) => handleChange("introduce", v)}
          />

          <GenderButtons
            value={form.gender}
            getValue={(v) => {
              handleChange("gender", v as Gender);
            }}
          />

          <AgeCalculator
            defaultValue={form.birthday}
            getValue={(v) => {
              handleChange("birthday", v.birthDate as Date);
            }}
          />

          <SelectedOption />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },

  formContainer: {
    paddingHorizontal: 16,
    display: "flex",
    justifyContent: "center",
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 3,
    padding: 10,
    width: "50%",
    borderRadius: 8,
    borderColor: Colors.button,
  },
});

export default AboutMe;
