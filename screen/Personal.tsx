import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import BorderButton from "../components/ui/BorderButton";
import HeadShot from "../components/personal/HeadShot";
import MultipleText from "../components/ui/MultipleText";
import Button from "../components/ui/Button";
import { AuthContext } from "../store/authContext";

interface PersonalProps {
  navigation: NavigationProp<any>;
}

//TODO:到時候再想 資料格式要怎麼存
const interestList = ["看劇", "看電影"];
const foodList = ["日式", "美式"];
const dataList = {
  interest: ["看劇", "看電影"],
  food: ["日式", "美式"],
};

const Personal: React.FC<PersonalProps> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot name="Lin" navigation={navigation}  />

        {/* 性別 */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>自我介紹：HI</Text>
          <Text style={styles.label}>性別：</Text>
          <Text style={styles.label}>生日：</Text>
          <Text style={styles.label}>年齡：</Text>

          <MultipleText label="興趣" dataList={interestList} />
          <MultipleText label="美食" dataList={foodList} />
          <Button
            text="登出"
            onPress={() => {
              // 確保isAuthenticated:false才跳轉login頁面
              authCtx.logout().then(() => {
                navigation.navigate("login");
              });
            }}
          />
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
});

export default Personal;
