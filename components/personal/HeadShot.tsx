import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { UserIcon } from "lucide-react-native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
interface HeadShotProps {
  navigation: NavigationProp<any>;
}

const HeadShot: React.FC<HeadShotProps> = ({ navigation }) => {
  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("avatarCreator")}
      >
        <Image
          source={require("../../assets/people/woman/girl.png")}
          style={styles.optionImage}
          resizeMode="contain"
        />
      </TouchableOpacity >

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
  optionImage: {
    width: "100%",
    height: "100%",
  },
});

export default HeadShot;
