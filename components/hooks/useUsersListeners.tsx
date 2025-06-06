import { useEffect } from "react";
import { UsersDBType } from "shared/dbType";
import {
  addBeAddFriend,
  selectFriendList,
  selectUser,
  updateFriendUser,
  updatePostUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { getUserDetail } from "util/handleUserEvent";
import { supabase } from "util/supabaseClient";

/*
INSERT: 新用戶
UPDATE: 好友變更名字或自介
*/
export const useUsersListeners = () => {
  const friendList = useAppSelector(selectFriendList);
  const personal = useAppSelector(selectUser);
  const friendIds = friendList
    .map((friend) => friend.userId)
    .concat(personal.userId);

  const dispatch = useAppDispatch();

  console.log("friendIds", friendIds);

  // 監聽新用戶
  useEffect(() => {
    const insertUsersChannel = supabase
      .channel("public:user_insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        async (payload) => {
          const newUser = payload.new as UsersDBType;
          const userDetail = await getUserDetail({
            userId: newUser.id,
          });

          console.log("新用戶", userDetail);
          dispatch(addBeAddFriend(userDetail));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(insertUsersChannel);
    };
  }, []);

  // 監聽好友有變更name 、introduce
  useEffect(() => {
    if (friendIds.length === 0) return; // 避免無好友時訂閱
    const updateUsersChannel = supabase
      .channel("public:user_update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=in.(${friendIds.join(",")})`,
        },
        (payload) => {
          console.log("好友更新", payload.new);
          // 更新dispatch 的 friendList

          const updatePayload = payload.new as UsersDBType;

          const updatedUser = {
            userId: updatePayload.id,
            name: updatePayload.name,
            introduce: updatePayload.introduce,
          };
          dispatch(updateFriendUser(updatedUser));
          dispatch(updatePostUser(updatedUser));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(updateUsersChannel);
    };
  }, [friendIds]);
};
