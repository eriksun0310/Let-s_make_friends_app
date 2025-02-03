import { useEffect } from "react";
import { UserHeadShotDBType } from "shared/dbType";
import {
  selectFriendList,
  updateFriendUser,
  updatePostUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { supabase } from "util/supabaseClient";

/*
UPDATE: 好友變更大頭貼
*/
export const useUserHeadShotListeners = () => {
  const friendList = useAppSelector(selectFriendList);
  const friendIds = friendList.map((friend) => friend.userId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (friendIds.length === 0) return; // 避免無好友時訂閱
    const userHeadShotChannel = supabase
      .channel("public:user_head_shot_update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_head_shot",
          filter: `user_id=in.(${friendIds.join(",")})`,
        },
        (payload) => {
          const updatePayload = payload.new as UserHeadShotDBType & {
            user_id: string;
          };
          console.log("好友頭像更新", updatePayload);

          const updatedUser = {
            userId: updatePayload.user_id,
            headShot: {
              imageUrl: updatePayload.image_url,
              imageType: updatePayload.image_type,
            },
          };

          console.log("updatedUser  ====>", updatedUser);
          dispatch(updateFriendUser(updatedUser));
          dispatch(updatePostUser(updatedUser));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userHeadShotChannel);
    };
  }, [friendIds]);
};
