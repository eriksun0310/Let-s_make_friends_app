import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import {
  selectLikeDrawer,
  setLikeDrawer,
  useAppDispatch,
  useAppSelector,
} from "../../../store";

const LikeDrawer = ({}) => {
  const modalizeRef = useRef<{
    open: () => void;
    close: () => void;
  }>(null);

  const dispatch = useAppDispatch();

  const likeDrawer = useAppSelector(selectLikeDrawer);

  useEffect(() => {
    if (likeDrawer) {
      modalizeRef.current?.open(); // 如果 likeDrawer 是 true，打開 Modal
    } else {
      modalizeRef.current?.close(); // 否則關閉 Modal
    }
  }, [likeDrawer, modalizeRef]);

  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={650}
      modalHeight={650}
      onOpen={() => dispatch(setLikeDrawer(true))} // 當開啟時更新 Redux 狀態
      onClose={() => dispatch(setLikeDrawer(false))} // 當關閉時更新 Redux 狀態
    //   isOpen={likeDrawer} // 透過 Redux 控制開啟/關閉

      //   closeOnOverlayTap={false} // 點擊背景 不要關閉
    >
      <View style={styles.container}>
        <Text>LikeDrawer</Text>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default LikeDrawer;
