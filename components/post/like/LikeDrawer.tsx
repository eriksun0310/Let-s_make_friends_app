import React, { useEffect, useRef } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { Modalize } from "react-native-modalize";
import {
  selectLikeDrawer,
  setLikeDrawer,
  useAppDispatch,
  useAppSelector,
} from "../../../store";
import { PostLikeUser } from "../../../shared/types";
import LikeUser from "./LikeUser";

import AntDesign from "@expo/vector-icons/AntDesign";
interface LikeDrawerProps {
  postLikes: PostLikeUser[];
}

const LikeDrawer: React.FC<LikeDrawerProps> = ({ postLikes }) => {
  const modalizeRef = useRef<{
    open: () => void;
    close: () => void;
  }>(null);

  const dispatch = useAppDispatch();

  const likeDrawer = useAppSelector(selectLikeDrawer);

  const renderLikeUser = ({ item }: { item: PostLikeUser }) => {
    return <LikeUser item={item} />;
  };


  console.log('postLikes',postLikes)
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
        <View style={styles.totalHeart}>
          <Text>說讚的用戶</Text>
        </View>
        <View style={styles.totalHeart}>
          <AntDesign name="heart" size={24} color="#ff6666" />
          <View style={{ marginLeft: 5 }}>
            <Text>{postLikes.length}</Text>
          </View>
        </View>

        <View style={styles.totalHeart}>
          <Text style={{ fontSize: 12, color: "gray" }}>
            只有你可以看到這則貼文的總按讚數
          </Text>
        </View>

        <FlatList
          data={postLikes}
          renderItem={renderLikeUser}
          keyExtractor={(item) => item?.userId}
        />
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  totalHeart: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "center",
  },
});
export default LikeDrawer;
