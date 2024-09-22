import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tab = ({
  tabs = {
    people: "人像",
    animal: "動物",
  },
}) => {
  return (
    <View style={styles.tab}>
      {/* {Object.keys(tabs).map((key) => (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={
            () => console.log("key", key)
            // setType("people")
          }
        >
          <Text
            style={{
              color: key ? "#3D74DB" : "#000",
            }}
          >
            {tabs[key]}
          </Text>
        </TouchableOpacity>
      ))} */}
      <TouchableOpacity
        style={styles.tabButton}
        // onPress={() => setType("people")}
      >
        <Text
          style={{
            color: type === "people" ? "#3D74DB" : "#000",
          }}
        >
          人像
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        // onPress={() => setType("animal")}
      >
        <Text
          style={{
            color: type === "animal" ? "#3D74DB" : "#000",
          }}
        >
          動物
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  tabButton: {
    marginHorizontal: 20,
    alignItems: "center",
  },
});

export default Tab;
