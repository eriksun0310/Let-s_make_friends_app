import React, { useCallback, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Colors } from "../../../constants/style";
import LikeDrawer from "./LikeDrawer";
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

  // 打開 bottom drawer
  // const openBottomDrawer = (event) => {
  //   event.persist(); // 保留事件原始資料
  //   console.log("openBottomDrawer");
  //   modalizeRef.current?.open();
  // };
  const openBottomDrawer = () => {
    // modalizeRef.current?.open();
    dispatch(setLikeDrawer(!likeDrawer));
  };
  const handleCloseDrawer = () => {
    modalizeRef.current?.close();
  };

  return (
    <>
      <View style={{ marginTop: 15 }}>
        <TouchableOpacity onPress={openBottomDrawer}>
          <Text style={{ color: Colors.textGrey }}>已說讚的人</Text>
        </TouchableOpacity>
      </View>

      <LikeDrawer modalizeRef={modalizeRef} onClose={handleCloseDrawer} />
    </>
  );
};

export default ShowLikeUser;
