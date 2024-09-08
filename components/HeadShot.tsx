import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { UserIcon } from "lucide-react-native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
interface HeadShotProps {
  navigation: NavigationProp<any>;
}

const HeadShot: React.FC<HeadShotProps> = ({ navigation }) => {
  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <TouchableOpacity onPress={() => navigation.navigate("avatarCreator")}>
          <UserIcon size={60} color="#ccc" />
        </TouchableOpacity>
      </View>
      {/* 名稱 */}
      <Text style={styles.label}>Lin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ADD8E6",
  },
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
});

export default HeadShot;
