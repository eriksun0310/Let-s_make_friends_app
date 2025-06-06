import { useEffect } from "react";
import { UserSelectedOptionDBType } from "shared/dbType";
import {
  selectFriendList,
  selectUser,
  updateFriendUser,
  updatePostUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { supabase } from "util/supabaseClient";

/*
UPDATE: 好友變更喜好
*/
export const useUserSelectedOptionListeners = () => {
  const friendList = useAppSelector(selectFriendList);
  const personal = useAppSelector(selectUser);
  const friendIds = friendList
    .map((friend) => friend.userId)
    .concat(personal.userId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (friendIds.length === 0) return; // 避免無好友時訂閱
    const userSelectedOptionChannel = supabase
      .channel("public:user_selected_option_update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_selected_option",
          filter: `user_id=in.(${friendIds.join(",")})`,
        },
        (payload) => {
          const updatePayload = payload.new as UserSelectedOptionDBType & {
            user_id: string;
          };
          console.log("好友喜好更新", updatePayload);

          const updatedUser = {
            userId: updatePayload.user_id,
            selectedOption: {
              interests: updatePayload.interests,
              favoriteFood: updatePayload.favorite_food,
              dislikedFood: updatePayload.disliked_food,
            },
          };
          dispatch(updateFriendUser(updatedUser));
          dispatch(updatePostUser(updatedUser));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userSelectedOptionChannel);
    };
  }, [friendIds]);
};
