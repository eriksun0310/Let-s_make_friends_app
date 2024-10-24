import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import HeadShot from "../components/personal/HeadShot";
import Button from "../components/ui/Button";
import TextLabel from "../components/ui/Text";
import { RootState, useDispatch } from "../store/store";
import SelectedOption from "../components/aboutMe/SelectedOption";
import { logout } from "../store/userSlice";
import { useSelector } from "react-redux";
import { calculateAge } from "../shared/funcs";

interface PersonalProps {
  navigation: NavigationProp<any>;
}

const Personal: React.FC<PersonalProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
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
          <TextLabel label="年齡" value={calculateAge(user.birthday)} />
          {/* <Text style={styles.label}>年齡：</Text> */}

          <SelectedOption />
          <Button
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
