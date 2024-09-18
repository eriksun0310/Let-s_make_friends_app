import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import Button from "../../ui/Button";
import FlatButton from "../../ui/FlatButton";
import { useNavigation } from "@react-navigation/native";
import { IsValidItem } from "../register/RegisterContent";
import * as Google from "expo-auth-session/providers/google";
import { firebase } from "../../../util/firebase";

interface LoginContentProps {
  getValue: (email: string) => void;
  isValid: IsValidItem;
}

const LoginContent: React.FC<LoginContentProps> = ({ getValue, isValid }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "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",
    androidClientId: "你的Android客戶端ID",
    iosClientId: "你的iOS客戶端ID",
    // redirectUri: Google.makeRedirectUri({
    //   useProxy: true, // 在開發階段使用Expo代理服務
    // }),
  });

  const navigation = useNavigation();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      // firebase
      //   .auth()
      //   .signInWithCredential(credential)
      //   .then(() => {
      //     // 導向到 "main" 畫面
      //     // navigation.navigate("main");
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    }
  }, [response]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>歡迎回來</Text>

        <CustomTextInput
          isValid={isValid}
          label="信箱"
          value={value}
          setValue={(v) => {
            console.log("v", v);
            setValue(v);
          }}
        />
        <CustomTextInput
          isValid={isValid}
          label="密碼"
          value={value}
          setValue={(v) => {
            console.log("v", v);
            setValue(v);
          }}
          secure
        />
        <Button
          text="登入"
          onPress={() => {
            getValue(value);
          }}
        />

        <Text>透過以下方式登入:</Text>
        <Button
          text="Google"
          onPress={() => {
            promptAsync();
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

export default LoginContent;
