import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/style";
import HeadShot from "../components/personal/HeadShot";
import Input from "../components/ui/Input";

import GenderButtons from "../components/ui/GenderButtons";
import AgeCalculator from "../components/ui/AgeCalculator";
import { Gender } from "../components/ui/types";
import { HeadShot as HeadShotType } from "../shared/types";
import SelectedOption from "../components/aboutMe/SelectedOption";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { RootState } from "../store/store";
const interestList = ["看劇", "看電影"];
const foodList = ["日式", "美式"];

interface From {
  headShot: HeadShotType;
  name: string;
  introduce: string;
  gender: Gender;
  birthday: string;
  age: number;
}

const AboutMe = ({ navigation }) => {
  const user = useSelector((state:RootState) => state.user);
  const dispatch = useDispatch();

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

      dispatch(
        setUser({
          birthday: formattedDate,
        })
      );
    } else {
      dispatch(
        setUser({
          [name]: value,
        })
      );
    }
  };

  console.log("user", user);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot navigation={navigation} headShot={user.headShot} />

        {/* 性別 */}
        <View style={styles.formContainer}>
          <Input
            label="名稱"
            value={user.name}
            setValue={(v) => handleChange("name", v)}
          />
          <Input
            multiline
            label="自我介紹"
            value={user.introduce}
            setValue={(v) => handleChange("introduce", v)}
          />
          <Text style={styles.label}>性別：</Text>
          <GenderButtons
            value={user.gender}
            getValue={(v) => {
              handleChange("gender", v as Gender);
            }}
          />

          <AgeCalculator
            defaultValue={user.birthday}
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
    // flexDirection: "column",
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
