import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";
import HeadShot from "../components/personal/HeadShot";
import MultipleText from "../components/ui/MultipleText";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import GenderButtons from "../components/ui/GenderButtons";
import AgeCalculator from "../components/ui/AgeCalculator";
import { Gender } from "../components/ui/types";
import { HeadShot as HeadShotType } from "../shared/types";
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
  const [form, setForm] = useState<From>({
    headShot: {
      imageUrl: "",
      imageType: "people",
    },
    name: "",
    introduce: "",
    gender: "male",
    birthday: "",
    age: 0,
  });
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

  console.log("form", form.headShot);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot
          navigation={navigation}
          headShot={form.headShot}
          setHeadShot={(v) => handleChange("headShot", v)}
        />

        {/* 性別 */}
        <View style={styles.formContainer}>
          <Input
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
          <Text style={styles.label}>性別：</Text>
          <GenderButtons
            getValue={(v) => {
              handleChange("gender", v as Gender);
            }}
          />

          <AgeCalculator
            getValue={(v) => {
              handleChange("birthday", v.birthDate as Date);
              handleChange("age", v.age as number);
            }}
          />

          <MultipleText label="興趣" dataList={interestList} />
          <MultipleText label="美食" dataList={foodList} />
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