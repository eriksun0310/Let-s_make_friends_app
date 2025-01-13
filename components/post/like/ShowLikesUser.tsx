import React, { useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Colors } from "../../../constants/style";
import {
  selectLikeDrawer,
  setLikeDrawer,
  useAppDispatch,
  useAppSelector,
} from "../../../store";

/*
打開下拉式選單
1.總計說讚的人
2.列出說讚的人
*/
const ShowLikeUser = () => {
  const dispatch = useAppDispatch();

  const likeDrawer = useAppSelector(selectLikeDrawer);

  const modalizeRef = useRef<{
    open: () => void;
    close: () => void;
  }>(null);
  const openBottomDrawer = () => {
    dispatch(setLikeDrawer(!likeDrawer));
  };

  return (
    <>
      <View style={{ marginTop: 15 }}>
        <TouchableOpacity onPress={openBottomDrawer}>
          <Text style={{ color: Colors.textGrey }}>已說讚的人</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ShowLikeUser;
