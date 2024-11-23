import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import SelectedHeadShot from "../components/editHeadShot/SelectedHeadShot";
import AllHeadShot from "../components/editHeadShot/AllHeadShot";
import { HeadShot } from "../shared/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser } from "../store/userSlice";
import { NavigationProp } from "@react-navigation/native";

import { Colors } from "../constants/style";
import BackButton from "../components/ui/button/BackButton";
import SaveButton from "../components/ui/button/SaveButton";
import { saveUserHeadShot } from "../util/person";
import { Screen } from "../shared/types";

interface AvatarCreatorProps {
  navigation: NavigationProp<any>;
  route: {
    params: {
      screen: Screen;
    };
  };
}

const EditHeadShot: React.FC<AvatarCreatorProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { screen } = route.params;

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

    // 判斷哪個畫面需要打api
    if (screen === "userInfo") {
      await saveUserHeadShot({
        user: {
          ...user,
          headShot,
        },
      });
    }

    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: "編輯大頭貼",
      headerTitleAlign: "center",
      headerLeft: () => <BackButton navigation={navigation} />,
      headerRight: () => <SaveButton onPress={handleSave} />,
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
  headerText: {
    marginHorizontal: 15,
  },
  headerTextColor: {
    color: Colors.textBlue,
  },
});

export default EditHeadShot;
