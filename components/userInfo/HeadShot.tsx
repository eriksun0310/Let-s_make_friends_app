import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import ShowHeadShot from "../editHeadShot/ShowHeadShot";
import { HeadShot as HeadShotType, UserState } from "../../shared/types";
import { Screen } from "../../shared/types";
import { MessageCircle, MessageCircleMore } from "lucide-react-native";

interface HeadShotProps {
  userState: UserState;
  screen: Screen; // 判斷是哪個頁面的大頭貼
  nameValue?: string;
  navigation: NavigationProp<any>;
  headShot: HeadShotType;
}

const HeadShot: React.FC<HeadShotProps> = ({
  userState,
  screen,
  nameValue,
  navigation,
  headShot,
}) => {
  // 是個人
  const isPersonal = userState === "personal";

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          isPersonal && navigation.navigate("editHeadShot", { screen })
        }
      >
        <ShowHeadShot imageUrl={headShot?.imageUrl} />
      </TouchableOpacity>

      {/* 名字 */}
      {nameValue && (
        <TouchableOpacity
          onPress={() =>
            isPersonal &&
            navigation.navigate("editUserInfo", {
              mode: "name",
              defaultValue: nameValue,
            })
          }
        >
          <Text style={styles.label}>{nameValue}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    width: 150,
    height: 150,
  },
});

export default HeadShot;
