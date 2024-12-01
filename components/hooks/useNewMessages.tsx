import React, { useEffect } from "react";
import { supabase } from "../../util/supabaseClient";

export const useNewMessages = ({ chatRoomId, handleNewMessage }) => {
  useEffect(() => {
    if (!chatRoomId) return;

    const subscription = supabase
      .from(`messages:chat_room_id=eq.${chatRoomId}`)
      .on("INSERT", (payload) => {
    
        handleNewMessage(payload.new);
      })
      .subscribe();

    return () => {
      // 確保在組件卸載時取消訂閱
      subscription.unsubscribe();
    };
  }, [chatRoomId]);
};
