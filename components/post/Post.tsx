import React from "react";
import { View, StyleSheet, Text, ImageSourcePropType } from "react-native";
import { PostDetail, PostScreen, UserState } from "../../shared/types";
import CustomMenu from "../ui/CustomMenu";
import { Card, Avatar } from "@rneui/themed";
import { Colors } from "../../constants/style";
import { formatTimeWithDayjs } from "../../shared/user/userFuncs";
import PostTags from "./PostTags";
import AntDesign from "@expo/vector-icons/AntDesign";
import { UserRound } from "lucide-react-native";
import { selectUser, useAppSelector } from "../../store";
import LikesAndComments from "./LikesAndComments";
interface PostProps {
  userState: UserState;
  postDetail: PostDetail;
  showTags?: boolean;
  screen?: PostScreen;
}
// export const tagList = Array(5).fill({
//   text: "大家好",
// });

const Post: React.FC<PostProps> = ({
  screen = "home",
  userState,
  postDetail,
  showTags = false,
}) => {
  const personal = useAppSelector(selectUser);
  const { post, user, tags } = postDetail;
  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.header}>
        <Avatar
          source={user?.headShot?.imageUrl as ImageSourcePropType}
          containerStyle={styles.avatar}
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
        <LikesAndComments postDetail={postDetail} screen={screen} />
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
});

export default Post;
