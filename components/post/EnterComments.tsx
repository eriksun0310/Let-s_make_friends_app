import { SendHorizontal } from "lucide-react-native";
import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../constants/style";

// 輸入留言
const EnterComments = () => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="留言..."
        placeholderTextColor="#999"
        onPress={() => {
          console.log(1111);
        }}
      />

      <SendHorizontal
        color={Colors.iconBlue}
        style={{
          marginHorizontal: 5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 22,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 20,
    fontSize: 14,
  },
});
export default EnterComments;
