import React from "react";
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
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextStyle>;
  navigation?: NavigationProp<any>;
  showCancel?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  style,
  navigation,
  showCancel = false,
}) => {
  return (
    <View style={[styles.searchBarContainer, style]}>
      <View style={styles.searchBar}>
        <SearchIcon color={Colors.icon} size={25} />
        <TextInput
          value={value}
          placeholder="搜尋"
          style={styles.searchInput}
          onChangeText={(e) => onChangeText(e)}
        />
        {value && (
          <CustomIcon
            style={{
              marginHorizontal: 5,
            }}
            onPress={() => onChangeText("")}
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
    backgroundColor: "#ffffff",
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
