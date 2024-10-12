import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import BorderButton from "../components/ui/BorderButton";
import HeadShot from "../components/personal/HeadShot";
import MultipleText from "../components/ui/MultipleText";
import Button from "../components/ui/Button";
import { AuthContext } from "../store/authContext";
import { useSelector } from "react-redux";
import TextLabel from "../components/ui/Text";
import { RootState } from "../store/store";
import SelectedOption from "../components/aboutMe/SelectedOption";

interface PersonalProps {
  navigation: NavigationProp<any>;
}

const interestList = ["看劇", "看電影"];
const foodList = ["日式", "美式"];
const dataList = {
  interest: ["看劇", "看電影"],
  food: ["日式", "美式"],
};

const Personal: React.FC<PersonalProps> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const user = useSelector((state: RootState) => state.user);

  console.log("user", user);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot
          name={user.name}
          navigation={navigation}
          headShot={user.headShot}
        />

        {/* 性別 */}
        <View style={styles.formContainer}>
          <TextLabel label="自我介紹" value={user.introduce} />
          <TextLabel label="性別" value={user.gender} />
          <TextLabel label="生日" value={user.birthday} />
          <Text style={styles.label}>年齡：</Text>

          <SelectedOption />
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
