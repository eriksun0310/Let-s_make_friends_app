import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Avatar } from "@rneui/themed";
import { Colors } from "../constants/style";
import CustomIcon from "../components/ui/CustomIcon";
import { X } from "lucide-react-native";
import SearchBar from "../components/ui/SearchBar";
import { NavigationProp } from "@react-navigation/native";
const recentSearches = [
  { id: "1", name: "海鴨" },
  { id: "2", name: "我是海鴨" },
];

interface SearchProps {
  navigation: NavigationProp<any>;
}

// 搜尋頁面
const Search: React.FC<SearchProps> = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 搜尋列 */}
        <SearchBar navigation={navigation} />

        <View
          style={{
            padding: 10,
          }}
        >
          {/* 近期搜尋標題 */}
          <Text style={styles.recentSearchTitle}>近期搜尋</Text>

          {/* 近期搜尋列表 */}
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.searchItem}>
                <Avatar
                  rounded
                  source={require("../assets/animal/ostrich.png")}
                  size="medium"
                />
                <Text style={styles.searchText}>{item.name}</Text>

                <CustomIcon onPress={() => console.log("close")}>
                  <X color={Colors.icon} />
                </CustomIcon>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 3,
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  cancelText: {
    fontSize: 17,
    color: "#999",
    marginRight: 8,
  },
  recentSearchTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Search;
