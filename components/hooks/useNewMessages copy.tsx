import React, { useEffect, useState } from "react";
import { supabase } from "../../util/supabaseClient";

export const useNewMessages = ({ chatRoomId, handleNewMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!chatRoomId) return;

    const subscription = supabase
      .from("messages")
      .select("*")
      .eq("chat_room_id", chatRoomId)
      .on("INSERT", (payload) => {
        console.log("payload", payload);
        // handleNewMessage(payload.new);
        // setNewMessage(payload.new);
      })
      .subscribe();

    return () => {
      // 確保在組件卸載時取消訂閱
      subscription.unsubscribe();
    };
  }, [chatRoomId]);
};
