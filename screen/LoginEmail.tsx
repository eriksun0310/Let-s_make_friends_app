import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";


import { Colors } from "../constants/style";

import CustomTextInput from "../components/ui/CustomTextInput";
import FlatButton from "../components/ui/FlatButton";
import Button from "../components/ui/Button";

const LoginEmail = ({ navigation }) => {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>歡迎回來</Text>

        {/* login form 拆出去 */}

        <CustomTextInput label="Email" value={email} setValue={setEmail} />
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
