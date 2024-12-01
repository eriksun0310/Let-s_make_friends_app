import React, { useEffect, useState } from "react";
import { supabase } from "../../util/supabaseClient";
import { Message } from "../../shared/types";

const initialMessage = {
  chat_room_id: "",
  content: "",
  created_at: "",
  id: "",
  is_read: false,
  recipient_id: "",
  sender_id: "",
};

export const useNewMessages = ({
  chatRoomId,
  tempId,
}: {
  chatRoomId: string;
  tempId: string;
}) => {
  const [newMessage, setNewMessage] = useState<Message>();

  useEffect(() => {
    if (!chatRoomId) return;

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNewMessage({
              ...payload.new,
              tempId: tempId,
            });
          }
        }
      )
      .subscribe();

    return () => {
      // 確保在組件卸載時取消訂閱
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [chatRoomId]);

  return {
    newMessage,
  };
};
