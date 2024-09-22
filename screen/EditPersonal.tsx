import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const EditPersonal = () => {
  return (
    <View style={styles.screen}>
      <Text>編輯 個人資料</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default EditPersonal;
