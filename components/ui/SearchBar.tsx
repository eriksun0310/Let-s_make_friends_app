import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  StyleProp,
  TextStyle,
} from "react-native";
import CustomIcon from "./button/CustomIcon";
import { SearchIcon, X } from "lucide-react-native";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";

interface SearchBarProps {
  style?: StyleProp<TextStyle>;
  navigation?: NavigationProp<any>;
  showCancel?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  style,
  navigation,
  showCancel = false,
}) => {
  const [searchText, setSearchText] = useState("");

  return (
    <View style={[styles.searchBarContainer, style]}>
      <View style={styles.searchBar}>
        <CustomIcon
          style={{
            marginHorizontal: 0,
          }}
          onPress={() => navigation?.navigate("search")}
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
      {showCancel && (
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.rightText}>取消</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
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
    // width: "100%",
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    height: 40,
  },
  rightText: {
    fontSize: 17,
    color: "#999",
    marginRight: 8,
  },
});
export default SearchBar;
