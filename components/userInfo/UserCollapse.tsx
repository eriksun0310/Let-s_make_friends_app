import React, { useState } from "react";
import { ListItem } from "@rneui/themed";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { optionList, tabs } from "../../shared/static";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";

//TODO: 要傳入user value 個人資料清單

interface UserCollapseProps {
  navigation: NavigationProp<any>;
}

const UserCollapse: React.FC<UserCollapseProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.user);

  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.container}>
      <ListItem.Accordion
        content={
          <>
            <ListItem.Content>
              <ListItem.Title>個人資料</ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
      >
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>自我介紹: hi</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>性別: 男</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>生日: 2000-01-01</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>年齡 :24</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        {Object.keys(tabs).map((key) => {
          return (
            <ListItem>
              <ListItem.Content>
                <TouchableOpacity
                  style={styles.listItemContainer}
                  onPress={() =>
                    navigation.navigate("aboutMeSelectOption", {
                      currentTab: key,
                    })
                  }
                >
                  <View>
                    <Text>{tabs[key]}:</Text>
                  </View>
                  <View style={styles.optionContainer}>
                    {user.selectedOption[key]?.length > 0 ? (
                      user.selectedOption[key]?.map((item, index) => {
                        const isLastItem =
                          index === user.selectedOption[key]?.length - 1;
                        const option = optionList?.[key]?.[item];

                        return (
                          <Text key={index}>
                            {option}
                            {!isLastItem && "、"}
                          </Text>
                        );
                      })
                    ) : (
                      <Text style={styles.pleaseSelectText}>請選擇</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </ListItem.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },

  listItemContainer: {
    display: "flex",
    flexDirection: "row",
  },
  optionContainer: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
  },
  pleaseSelectText: {
    color: Colors.textBlue,
  },
});
export default UserCollapse;
