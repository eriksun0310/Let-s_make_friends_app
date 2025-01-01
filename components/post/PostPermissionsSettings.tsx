import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import SegmentedButtons from "../ui/button/SegmentedButtons";
import { segmentedButtons } from "../../shared/static";
import { Colors } from "../../constants/style";

// 貼文權限設定
const PostPermissionsSettings = () => {
  const [permissions, setPermissions] = useState("all");
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.label}>文章權限設定</Text>
      </View>
      <View>
        <SegmentedButtons
          buttons={segmentedButtons("personal")}
          onValueChange={setPermissions}
          initialValue={permissions}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: Colors.textGrey,
    fontSize: 15,
  },
});

export default PostPermissionsSettings;
