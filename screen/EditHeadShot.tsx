import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import SelectedHeadShot from "../components/editHeadShot/SelectedHeadShot";
import AllHeadShot from "../components/editHeadShot/AllHeadShot";
import { HeadShot } from "../shared/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser } from "../store/userSlice";
import { editUserData } from "../util/auth";
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/ui/BackButton";
import { Colors } from "../constants/style";

interface AvatarCreatorProps {
  navigation: NavigationProp<any>;
}

const EditHeadShot: React.FC<AvatarCreatorProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  //從 params 中獲取 headShot、setHeadShot

  const user = useSelector((state: RootState) => state.user.user);

  const [headShot, setHeadShot] = useState<HeadShot>({
    imageUrl: "",
    imageType: "people",
  });

  // 預設選中的大頭貼
  useEffect(() => {
    setHeadShot(user.headShot);
  }, [user]);

  const handleSave = async () => {
    // 更新回redux
    dispatch(setUser({ ...user, headShot }));
    // 更新firebase
    await editUserData({
      userId: user.userId,
      fieldName: "headShot",
      fieldValue: headShot,
    });
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: "編輯大頭貼",

      headerLeft: () => <BackButton navigation={navigation} />,
      // headerRight: () => <Button title="儲存" onPress={handleSave} />,

      headerRight: () => (
        <TouchableOpacity
          style={{
            marginHorizontal: 15,
          }}
          onPress={handleSave}
        >
          <Text
            style={{
              color: Colors.textBlue,
            }}
          >
            儲存
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, headShot]);

  return (
    <View style={styles.container}>
      {/*  顯示當前選中的大頭貼  */}
      <SelectedHeadShot headShot={headShot} />
      {/* 列出所有可供選擇的大頭貼 */}
      <AllHeadShot headShot={headShot} setHeadShot={setHeadShot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default EditHeadShot;
