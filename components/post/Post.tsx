import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import {
  PostDetail,
  Post as PostType,
  User,
  UserState,
} from "../../shared/types";
import CustomMenu from "../ui/CustomMenu";
import { Card, Avatar, Icon } from "@rneui/themed";
import { Colors } from "../../constants/style";

import { formatTimeWithDayjs } from "../../shared/user/userFuncs";
import PostTags from "./PostTags";
import AntDesign from "@expo/vector-icons/AntDesign";
import { UserRound } from "lucide-react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { selectUser, useAppSelector } from "../../store";
import { updatePostLikeDB } from "../../util/handlePostEvent";
interface PostProps {
  userState: UserState;
  postDetail: PostDetail;
  showTags?: boolean;
}
export const tagList = Array(5).fill({
  text: "大家好",
});

const Post: React.FC<PostProps> = ({
  userState,
  postDetail,
  showTags = false,
}) => {
  const personal = useAppSelector(selectUser);
  const { post, user, tags, postLikes, postComments } = postDetail;

  const [like, setLike] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  // 處理 按讚、收回讚
  const handleLikeChange = useCallback(async () => {
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
    } catch (error) {
      console.log(" 按讚失敗", error);
    } finally {
      setIsProcessing(false); // 恢復按鈕可點擊狀態
    }
  }, [like, post?.id, personal.userId]);

  useEffect(() => {
    const updateLike = async () => {
      const { success } = await updatePostLikeDB({
        postId: post?.id,
        userId: personal.userId,
        like: like,
      });
      if (success) {
        // 更新redux
      }
    };

    updateLike();
  }, [like]);

  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.header}>
        <Avatar
          rounded
          source={user?.headShot?.imageUrl as ImageSourcePropType}
          size="medium"
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{user?.name}</Text>
          <Text style={styles.timestamp}>
            {formatTimeWithDayjs(post?.createdAt)}{" "}
          </Text>
          <View></View>
        </View>
        {post.userId === personal.userId && (
          <>
            {post.visibility === "public" ? (
              <AntDesign name="earth" size={20} color={Colors.icon} />
            ) : (
              <UserRound color={Colors.icon} size={24} />
            )}
          </>
        )}

        {userState === "personal" && <CustomMenu postId={post?.id} />}
      </View>

      <Text style={styles.content}>{post?.content}</Text>

      {/* 文章標籤 */}
      {tags?.length > 0 && showTags && <PostTags tags={tags} />}

      {/* 訪客看不到留言與按讚 數 */}
      {(post.visibility === "public" || userState !== "visitor") && (
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

            <Text style={styles.iconText}>{postLikes?.length}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon
              name="comment"
              type="material-community"
              color={Colors.iconBlue}
            />
            <Text style={styles.iconText}>{postComments?.length}</Text>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ffffff",
    margin: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    color: "#999",
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    //borderWidth: 1,
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

export default Post;
