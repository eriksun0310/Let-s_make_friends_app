import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Tab, TabView } from "@rneui/themed";
import { useState } from "react";
import { Colors } from "../constants/style";
import RenderOption from "../components/aboutMe/RenderOption";
import HeadShot from "../components/personal/HeadShot";
import MultipleText from "../components/ui/MultipleText";
const interestList = ["看劇", "看電影"];
const foodList = ["日式", "美式"];
const tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
};
const AboutMe = ({ navigation }) => {
  const [index, setIndex] = useState(0);

  console.log("index", index);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot navigation={navigation} />

        {/* 性別 */}
        <View style={styles.formContainer}>
          
          <Text style={styles.label}>自我介紹：HI</Text>
          {/* <TextInput
            style={styles.input}
            // onChangeText={onChangeText}
            // value={text}
          /> */}
          <Text style={styles.label}>性別：</Text>
          <Text style={styles.label}>生日：</Text>
          <Text style={styles.label}>年齡：</Text>

          <MultipleText label="興趣" dataList={interestList} />
          <MultipleText label="美食" dataList={foodList} />
          {/* <Button
            text="登出"
            onPress={() => {
              // 確保isAuthenticated:false才跳轉login頁面
              authCtx.logout().then(() => {
                navigation.navigate("login");
              });
            }}
          /> */}
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
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AboutMe;
