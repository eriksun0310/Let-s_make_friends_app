import React, { useState } from "react";
import { ListItem } from "@rneui/themed";

//TODO: 要傳入user value 個人資料清單
const ProfileList = () => {
  const [expanded, setExpanded] = useState(false);
  return (
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

      <ListItem>
        <ListItem.Content>
          <ListItem.Title>興趣: 閱讀</ListItem.Title>
          {/* <ListItem.Subtitle>閱讀</ListItem.Subtitle> */}
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  );
};

export default ProfileList;
