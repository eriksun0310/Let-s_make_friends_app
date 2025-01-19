import React, { useEffect } from "react";
import { selectUser, useAppDispatch, useAppSelector } from "store";

// 用於 AddFriend.tsx 的監聽
export const useAddFriendListeners = () => {
  const personal = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    

  }, [personal.userId]);

  return <div>useAddFriendListeners</div>;
};
