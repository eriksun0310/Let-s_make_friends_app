import React from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
interface SelectedTagTextProps {
  selectedTags: string[];
  removeTag: (item: string) => void;
}
const SelectedTagText: React.FC<SelectedTagTextProps> = ({
  selectedTags,
  removeTag,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tagsContainer}
    >
      {selectedTags.map((tag, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tag}
          onPress={() => removeTag(tag)}
        >
          <Text style={styles.tagText}>{tag}</Text>
          <Text style={styles.removeIcon}>×</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tagText: {
    color: "#666",
    marginRight: 4,
  },
  removeIcon: {
    fontSize: 16,
    color: "#666",
  },
});

export default SelectedTagText;
