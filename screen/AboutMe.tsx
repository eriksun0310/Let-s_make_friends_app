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
const interestList = ["看劇", "看電影"];
const foodList = ["日式", "美式"];
const tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
};
const AboutMe = ({ navigation }) => {
  const [index, setIndex] = useState(0);

  const [form, setForm] = useState({
    name: "",
    introduce: "",
    gender: "",
    birthday: "",
    age: "",
  });
  //更新form state
  const handleChange = (name: string, value: string) => {
    if (name === "birthday") {
      const year = value?.getFullYear();
      const month = String(value?.getMonth() + 1).padStart(2, "0"); // 月份從0開始，所以要加1
      const day = String(value?.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      setForm((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log("form", form);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot navigation={navigation} />

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
              // console.log("gender", v);
              handleChange("gender", v);
            }}
          />

          <AgeCalculator
            getValue={(v) => {
              // console.log(v);
              handleChange("birthday", v.birthDate);
              handleChange("age", v.age);
            }}
          />
          {/* <Text style={styles.label}>生日：</Text> */}
          {/* <Text style={styles.label}>年齡：</Text> */}
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
