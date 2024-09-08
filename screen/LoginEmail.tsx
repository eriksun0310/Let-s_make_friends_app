import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import Button from "../components/Button";

import { Colors } from "../constants/style";
import FlatButton from "../components/FlatButton";
import CustomTextInput from "../components/CustomTextInput";

const LoginEmail = ({ navigation }) => {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>歡迎回來</Text>

        <CustomTextInput label="Email" />
        <Button
          text="繼續"
          onPress={() => {
            // TODO: 要去DB 確認有無會員
            navigation.navigate("loginPassword");
          }}
        />

        <FlatButton
          onPress={() => {
            navigation.navigate("register");
          }}
        >
          尚未有會員? 註冊會員
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

export default LoginEmail;
