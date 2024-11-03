import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Avatar, Icon } from "@rneui/themed";
import { Colors } from "../constants/style";
import CustomIcon from "../components/ui/CustomIcon";
import { Search as SearchIcon, X } from "lucide-react-native";
const recentSearches = [
  { id: "1", name: "海鴨" },
  { id: "2", name: "我是海鴨" },
];

// 搜尋頁面
const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  console.log("searchText", searchText);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 搜尋列 */}

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            paddingBottom: 10,
            // borderWidth: 1,
          }}
        >
          <View style={styles.searchBar}>
            <CustomIcon
              style={{
                marginHorizontal: 5,
              }}
              onPress={() => navigation.navigate("search")}
            >
              <SearchIcon color={Colors.icon} size={25} />
            </CustomIcon>
            <TextInput
              value={searchText}
              placeholder="搜尋"
              style={styles.searchInput}
              onChangeText={(e) => setSearchText(e)}
            />

            {searchText && (
              <CustomIcon
                style={{
                  marginHorizontal: 5,
                }}
                onPress={() => setSearchText("")}
              >
                <X color={Colors.icon} size={25} />
              </CustomIcon>
            )}
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </View>

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
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    // marginTop: 10,
    // padding: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efefef",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    // marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: 35,
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
