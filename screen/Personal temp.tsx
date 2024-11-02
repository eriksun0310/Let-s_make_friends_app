import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/userInfo/HeadShot";
import Button from "../components/ui/Button";
import TextLabel from "../components/ui/Text";
import { RootState, useDispatch } from "../store/store";
import SelectedOption from "../components/aboutMe/SelectedOption";
import { logout } from "../store/userSlice";
import { useSelector } from "react-redux";
import { calculateAge, getZodiacSign } from "../shared/funcs";
import { gender } from "../shared/static";

interface PersonalProps {
  navigation: NavigationProp<any>;
}

const Personal: React.FC<PersonalProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  console.log("user", user);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 大頭貼 */}
        <HeadShot
          nameValue={user.name}
          navigation={navigation}
          headShot={user.headShot}
        />

        {/* 性別 */}
        {/* <View style={styles.formContainer}>
          <TextLabel
            label="自我介紹"
            name="introduce"
            value={user.introduce}
            isEdit
          />
          <TextLabel label="性別" value={gender[user.gender]} />
          <TextLabel label="生日" value={user.birthday} />
          <TextLabel label="年齡" value={calculateAge(user.birthday)} />
          <TextLabel label="星座" value={getZodiacSign(user.birthday)} />
          <SelectedOption />
        </View> */}

        <View style={styles.formContainer1}>
          <Button
            style={{
              width: "50%",
            }}
            text="登出"
            onPress={() => {
              // 確保isAuthenticated:false才跳轉login頁面
              dispatch(logout()).then(() => {
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
  formContainer1: {
    display: "flex",
    marginTop: 100,
    alignItems: "center",
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
