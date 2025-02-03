import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { updatePostLikeDB } from "../../util/handlePostEvent";
import { selectUser, useAppDispatch, useAppSelector } from "../../store";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Icon } from "@rneui/themed";
import { Colors } from "../../constants/style";
import ShowLikeUser from "./like/ShowLikesUser";
import { PostDetail, PostScreen } from "../../shared/types";

interface LikesAndCommentsProps {
  postDetail: PostDetail;
  screen?: PostScreen;
}

const LikesAndComments: React.FC<LikesAndCommentsProps> = ({
  postDetail,
  screen,
}) => {
  const { post, postLikes, postComments, user } = postDetail;
  const userSettings = user?.settings;
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);
  const [like, setLike] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 處理 按讚、收回讚
  const handleLikeChange = useCallback(async () => {
    console.log("處理 按讚、收回讚 ");
    setIsProcessing(true); // 開始處理
    setLike(!like); // 樂觀更新
    try {
      const { success } = await updatePostLikeDB({
        postId: post?.id,
        userId: personal.userId,
        like: !like,
      });

      if (!success) {
        console.log("更新按讚失敗");
        setLike(!like);
      }

      // dispatch(
      //   addPostLike({
      //     postId: post?.id,
      //     userId: personal.userId,
      //     createdAt: new Date().toISOString(),
      //   })
      // );
    } catch (error) {
      console.log(" 按讚失敗", error);
    } finally {
      setIsProcessing(false); // 恢復按鈕可點擊狀態
    }
  }, [like, post?.id, personal.userId]);

  //  顯示已說讚的人 (文章是自己的貼文 & UI是貼文詳細)
  const showLikeUser =
    post.userId === personal.userId && screen === "postDetail";

  // 顯示按讚數　(用戶設定 按讚數隱藏）
  const showLikeCount = !userSettings?.hideLikes;

  // 顯示留言(用戶設定 留言數隱藏 || 文章是自己的貼文 & UI是貼文詳細)
  const showComments = !userSettings?.hideComments
    ? true
    : post.userId === personal.userId && screen === "postDetail";

  // 處理 按讚、收回讚 的預設值
  useEffect(() => {
    const isLike = postLikes.some((like) => like.userId === personal.userId);
    setLike(isLike);
  }, [postLikes]);
  return (
    <View>
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={handleLikeChange}
            disabled={isProcessing} // 禁用按鈕
          >
            <AntDesign
              name={like ? "heart" : "hearto"}
              size={24}
              color={like ? "#ff6666" : Colors.icon}
            />
          </TouchableOpacity>
          {showLikeCount && (
            <Text style={styles.iconText}>{postLikes?.length}</Text>
          )}
        </View>
        {showComments && (
          <View style={styles.iconContainer}>
            <Icon
              name="comment"
              type="material-community"
              color={Colors.iconBlue}
            />
            <Text style={styles.iconText}>{postComments?.length}</Text>
          </View>
        )}
      </View>

      {/* 已說讚的人 */}
      {showLikeUser && <ShowLikeUser />}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-start",

    borderTopColor: "#e0e0e0",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.icon,
  },
});
export default LikesAndComments;
