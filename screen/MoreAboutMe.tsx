import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const MoreAboutMe = () => {
  return (
    <View style={styles.screen}>
      <Text>更加認識我</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MoreAboutMe;
