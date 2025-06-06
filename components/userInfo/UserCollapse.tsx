import React, { useState } from "react";
import { ListItem } from "@rneui/themed";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { gender, optionList, tabs } from "../../shared/static";
import { Colors } from "../../constants/style";
import { NavigationProp } from "@react-navigation/native";
import { calculateAge, getZodiacSign } from "../../shared/user/userFuncs";
import { Snackbar } from "react-native-paper";
import { Tab, User, UserState } from "../../shared/types";

interface UserCollapseProps {
  userState: UserState;
  navigation: NavigationProp<any>;
  user: User;
}

const UserCollapse: React.FC<UserCollapseProps> = ({
  userState,
  navigation,
  user,
}) => {
  // 是個人
  const isPersonal = userState === "personal";

  const [expanded, setExpanded] = useState(false);
  // 顯示 Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // 顯示 Snackbar文字
  const [snackbarText, setSnackbarText] = useState("");

  const onToggleSnackBar = (text: string) => {
    setSnackbarText(text);
    setSnackbarVisible(!snackbarVisible);
  };

  const onDismissSnackBar = () => setSnackbarVisible(false);
  return (
    <View style={styles.container}>
      <ListItem.Accordion
        key={user.userId}
        content={
          <>
            <ListItem.Content>
              <ListItem.Title
                style={{
                  color: Colors.textGrey,
                }}
              >
                個人資料
              </ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
      >
        <ListItem>
          <ListItem.Content>
            <TouchableOpacity
              onPress={() =>
                isPersonal &&
                navigation.navigate("editUserInfo", {
                  mode: "introduce",
                  defaultValue: user.introduce,
                })
              }
            >
              <Text>自我介紹: {user.introduce}</Text>
            </TouchableOpacity>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <TouchableOpacity
              onPress={() => {
                isPersonal && onToggleSnackBar("性別");
              }}
            >
              <Text>性別: {gender[user.gender]}</Text>
            </TouchableOpacity>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <TouchableOpacity
              onPress={() => {
                isPersonal && onToggleSnackBar("生日");
              }}
            >
              <Text>生日: {user.birthday}</Text>
            </TouchableOpacity>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <TouchableOpacity
              onPress={() => {
                isPersonal && onToggleSnackBar("年齡");
              }}
            >
              <Text>年齡 :{calculateAge(user.birthday)}</Text>
            </TouchableOpacity>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <TouchableOpacity
              onPress={() => {
                isPersonal && onToggleSnackBar("星座");
              }}
            >
              <Text>星座 :{getZodiacSign(user.birthday)}</Text>
            </TouchableOpacity>
          </ListItem.Content>
        </ListItem>

        {Object.keys(tabs).map((key) => {
          return (
            <ListItem key={key}>
              <ListItem.Content>
                <TouchableOpacity
                  style={styles.listItemContainer}
                  onPress={() =>
                    isPersonal &&
                    navigation.navigate("aboutMeSelectOption", {
                      currentTab: key,
                      screen: "userInfo",
                    })
                  }
                >
                  <View>
                    <Text>{tabs[key as Tab]}:</Text>
                  </View>
                  <View style={styles.optionContainer}>
                    {user.selectedOption[key]?.length > 0 ? (
                      user.selectedOption[key]?.map((item, index) => {
                        const isLastItem =
                          index === user.selectedOption[key]?.length - 1;
                        const option = optionList?.[key as Tab]?.[item];

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

      <Snackbar
        duration={1000}
        style={{
          flex: 1,
          // width: "40%",
          borderRadius: 10,
          backgroundColor: Colors.snackbar, // 自訂背景顏色
        }}
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "X",
          onPress: onDismissSnackBar,
        }}
        icon={"close"}
        theme={{
          colors: {
            inversePrimary: Colors.textWhite, //自訂 X 的顏色
          },
        }}
      >
        <Text style={{ color: Colors.textWhite, fontSize: 16 }}>
          {snackbarText} 不可修改
        </Text>
      </Snackbar>
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
    paddingLeft: 5,
  },
  pleaseSelectText: {
    color: Colors.textBlue,
  },
});
export default UserCollapse;
