import React, { useState } from "react";
import { ListItem } from "@rneui/themed";
import { Text, View, StyleSheet } from "react-native";
import SegmentedButtons from "../ui/button/SegmentedButtons";

const buttons = [
  {
    value: "all",
    label: "全部",
  },
  {
    value: "public",
    label: "公開",
  },
  {
    value: "friends",
    label: "朋友",
  },
];

const permissionsText = {
  all: "全部",
  public: "公開",
  friends: "朋友",
};

// 貼文權限設定
const PostPermissionsSettings = () => {
  const [expanded, setExpanded] = useState(false);
  const [permissions, setPermissions] = useState("all");
  return (
    <View style={styles.container}>
      <ListItem.Accordion
        content={
          <>
            <ListItem.Content>
              <View style={styles.titleContainer}>
                <Text style={styles.label}>文章權限設定</Text>
                <Text style={styles.permissionsText}>
                  ({permissionsText[permissions]})
                </Text>
              </View>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
      >
        <ListItem>
          <ListItem.Content>
            <SegmentedButtons
              buttons={buttons}
              onValueChange={setPermissions}
              initialValue={permissions}
            />
          </ListItem.Content>
        </ListItem>
      </ListItem.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 15,
  },
  permissionsText: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "bold",
  },
});

export default PostPermissionsSettings;
