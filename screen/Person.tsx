import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XIcon, UserIcon } from "lucide-react-native";

const Personal: React.FC = () => {
  const [gender, setGender] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {/* <TouchableOpacity>
            <XIcon size={24} color="#000" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {/* 這裡要點 可以跳到 AvatarCreator */}
            <TouchableOpacity onPress={() => {}}>
              <UserIcon size={60} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 性別 */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Gender</Text>
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

          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={birthday}
            onChangeText={setBirthday}
          />

          <Text style={styles.label}>Nickname</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your nickname"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  nextButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
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
    borderColor: "#FFD700",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  termsContainer: {
    padding: 16,
    marginTop: "auto",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  termsLink: {
    fontSize: 14,
    color: "#3D74DB",
    marginBottom: 4,
  },
});

export default Personal;
