import React, { useState } from "react";
import { ListItem } from "@rneui/themed";
import { View, StyleSheet, Text } from "react-native";
import SelectedOption from "../aboutMe/SelectedOption";
import { optionList, tabs } from "../../shared/static";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Colors } from "../../constants/style";

//TODO: 要傳入user value 個人資料清單
const UserCollapse = ({ navigation }) => {
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
            {/* <ListItem.Subtitle>hi</ListItem.Subtitle> */}
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>性別: 男</ListItem.Title>
            {/* <ListItem.Subtitle>男</ListItem.Subtitle> */}
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>生日: 2000-01-01</ListItem.Title>
            {/* <ListItem.Subtitle>2000-01-01</ListItem.Subtitle> */}
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>年齡 :24</ListItem.Title>
            {/* <ListItem.Subtitle>24</ListItem.Subtitle> */}
          </ListItem.Content>
        </ListItem>

        {Object.keys(tabs).map((key) => {
          return (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title
                  onPress={() =>
                    navigation.navigate("aboutMeSelectOption", {
                      currentTab: key,
                    })
                  }
                >
                  <View>
                    <Text>{tabs[key]}:</Text>
                  </View>
                  <View>
                    {user.selectedOption[key]?.length > 0 ? (
                      user.selectedOption[key]?.map((item) => {
                        const option = optionList?.[key]?.[item];

                        return (
                          <Text
                            style={{
                              paddingLeft: 10,
                            }}
                          >
                            {option}
                          </Text>
                        );
                      })
                    ) : (
                      <Text
                        style={{
                          paddingLeft: 10,
                          color: Colors.textBlue,
                        }}
                      >
                        請選擇
                      </Text>
                    )}
                  </View>
                </ListItem.Title>
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
});
export default UserCollapse;
