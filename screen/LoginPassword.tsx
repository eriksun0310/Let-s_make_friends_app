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
  Pressable,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/style";

import CustomTextInput from "../components/ui/CustomTextInput";
import Button from "../components/ui/Button";

// TODO: 到時候要從DB 帶入名稱
const LoginPassword = ({ navigation }) => {
  //   const navigation = useNavigation();
  const [email, setEmail] = useState("");

  // 有會員
  const [isMember, setIsMember] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hi! Lin 歡迎回來</Text>

        {/* login form 拆出去 */}
        <CustomTextInput label="密碼"  value={email}  setValue={setEmail}/>

        {/* TODO: 要驗證DB 輸入的密碼是否正確 */}
        <Button
          text="登入"
          onPress={() => {
            navigation.navigate("main");
          }}
        />
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

export default LoginPassword;
