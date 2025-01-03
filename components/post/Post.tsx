import React, { useState } from "react";
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
  const { post, user, tags, postLikes, postComments } = postDetail;

  const [like, setLike] = useState(false);

  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.header}>
        <Avatar
          rounded
          source={user.headShot?.imageUrl as ImageSourcePropType}
          size="medium"
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.timestamp}>
            {formatTimeWithDayjs(post?.createdAt)}
          </Text>
        </View>
        {userState === "personal" && <CustomMenu postId={post.id} />}
      </View>

      <Text style={styles.content}>{post?.content}</Text>

      {/* 文章標籤 */}
      {tags.length > 0 && showTags && <PostTags tags={tags} />}

      {userState !== "visitor" && (
        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            {like ? (
              <TouchableOpacity onPress={() => setLike(false)}>
                <AntDesign name="heart" size={24} color="#ff6666" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setLike(true)}>
                <AntDesign name="hearto" size={24} color={Colors.icon} />
              </TouchableOpacity>
            )}

            <Text style={styles.iconText}>{postLikes.length}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon
              name="comment"
              type="material-community"
              color={Colors.iconBlue}
            />
            <Text style={styles.iconText}>{postComments.length}</Text>
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
