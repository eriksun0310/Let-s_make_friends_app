import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// TODO:到時候給 註冊頁面用 性別按鈕
const GenderButtons = () => {
  const [gender, setGender] = useState<string>("");
  return (
    <View style={styles.genderButtons}>
      {["Male", "Female", "Non-binary"].map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.genderButton,
            gender === option && styles.genderButtonSelected,
          ]}
          onPress={() => setGender(option)}
        >
          <Text
            style={[
              styles.genderButtonText,
              gender === option && styles.genderButtonTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  genderButtonSelected: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },
  genderButtonText: {
    textAlign: "center",
  },
  genderButtonTextSelected: {
    fontWeight: "bold",
  },
});

export default GenderButtons;
