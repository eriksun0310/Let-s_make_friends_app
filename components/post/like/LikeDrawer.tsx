import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Modalize } from "react-native-modalize";
import {
  selectLikeDrawer,
  setLikeDrawer,
  useAppDispatch,
  useAppSelector,
} from "../../../store";
import { PostLikes } from "../../../shared/types";
import { Avatar } from "react-native-elements";
import ostrich from "../../../assets/animal/ostrich.png";
interface LikeDrawerProps {
  postLikes: PostLikes[];
}

const LikeDrawer: React.FC<LikeDrawerProps> = ({ postLikes }) => {
  const modalizeRef = useRef<{
    open: () => void;
    close: () => void;
  }>(null);

  const dispatch = useAppDispatch();

  const likeDrawer = useAppSelector(selectLikeDrawer);

  const renderLikeUser = ({ item }) => {
    console.log("item", item);
    return (
      <View style={styles.likeItem}>
        <Avatar rounded source={ostrich} size="medium" />
        <Text style={styles.likeUser}>{item.userId}</Text>
      </View>
    );
  };

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
      {/* <View style={styles.container}>
        <Text>LikeDrawer</Text>
      </View> */}

      <FlatList
        data={postLikes}
        renderItem={renderLikeUser}
        keyExtractor={(item) => item?.userId}
      />
    </Modalize>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  likeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  likeUser: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});
export default LikeDrawer;
