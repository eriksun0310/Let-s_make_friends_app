import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import FlatButton from "../components/FlatButton";
import CustomTextInput from "../components/CustomTextInput";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>會員註冊</Text>

        <CustomTextInput label="名稱" />
        <CustomTextInput label="Email" />

        <CustomTextInput label="密碼" />
        <CustomTextInput label="確認密碼" />

        <Button
          text="註冊"
          //TODO: 要驗證DB 輸入的表單規則是否正確
          onPress={() => {
            navigation.replace("loginEmail");
          }}
        />
        <FlatButton
          onPress={() => {
            navigation.navigate("loginEmail");
          }}
        >
          已有會員? 會員登入
        </FlatButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
});

export default Register;
