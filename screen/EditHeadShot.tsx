import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import SelectedHeadShot from "../components/editHeadShot/SelectedHeadShot";
import AllHeadShot from "../components/editHeadShot/AllHeadShot";
import { HeadShot } from "../shared/types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface AvatarCreatorProps {}

const EditHeadShot: React.FC<AvatarCreatorProps> = ({ navigation }) => {
  //從 params 中獲取 headShot、setHeadShot

  const user = useSelector((state:RootState) => state.user.user);

  const [headShot, setHeadShot] = useState<HeadShot>({
    imageUrl: "",
    imageType: "people",
  });

  //步骤1.每次用户选择新头像时，useEffect 触发，更新 route.params.headShot
  useEffect(() => {
    navigation.setParams({ headShot });
  }, [headShot]);

  // 預設選中的大頭貼
  useEffect(() => {
    setHeadShot(user.headShot);
  }, [user]);

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
