import {useDelete, usePost} from "@/hooks/useApiCall";
import {useAuthContext} from "@/hooks/useAuth";
import useMessages, {MessageData} from "@/hooks/useMessages";
import React, {createContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {v4 as uuidv4} from "uuid";
import {recv_message} from "./AuthContext/AuthContext";

type messageData = {
  subject: string;
  body: string;
  receivers: string[];
};

interface NotificationProps {
  handleDraftMessage: (data: messageData) => Promise<void>;
  handleSendMessage: (data: messageData) => Promise<void>;
  handleRemoveMessage: (id: string) => Promise<void>;
  drafts: MessageData[];
  sentMessage: MessageData[];
  inboxMessage: recv_message[];
}

export const NotificationContext = createContext<NotificationProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {user, message, socket, messageId, setMessageId} = useAuthContext();
  const {post} = usePost("/messages");
  const {remove} = useDelete();
  const {
    draftMessages,
    inboxMessages,
    sentMessages,
    refetchDraft,
    refetchAll,
    refetchSent,
    refetchInbox,
  } = useMessages(user);
  const [drafts, setDrafts] = useState<MessageData[]>([]);
  const [sentMessage, setSentMessage] = useState<MessageData[]>([]);
  const [inboxMessage, setInboxMessage] = useState<recv_message[]>([]);
  // console.log(inboxMessage);
  useEffect(() => {
    if (inboxMessages && user !== null && !Array.isArray(user)) {
      const filteredMessage = inboxMessages.filter(message =>
        message.receivers.includes(user)
      );
      setInboxMessage(filteredMessage);
    }
  }, [inboxMessages, user]);

  useEffect(() => {
    if (message) {
      setInboxMessage(prevMessages => [message, ...prevMessages]);
    }
  }, [message]);

  useEffect(() => {
    if (draftMessages) {
      setDrafts(draftMessages.filter(message => message.status === "draft"));
    }
  }, [draftMessages]);

  useEffect(() => {
    if (sentMessages) {
      setSentMessage(sentMessages.filter(message => message.status === "sent"));
    }
  }, [sentMessages]);

  const handleMessages = async (data: messageData, status: string) => {
    const message = {
      ...data,
      id: uuidv4(),
      sender: user,
      status,
      date: new Date(),
    };

    if (status === "sent") {
      socket.emit("send_message", message);
    }

    const response = await post(message);
    if (response) {
      if (status === "draft") {
        refetchDraft();
      } else if (status === "sent") {
        refetchSent();
        refetchInbox();
      }
    }
  };

  const handleRemoveMessage = async (id: string) => {
    if (messageId) {
      setMessageId(messageId?.filter(msgId => msgId !== id));
    }
    try {
      const result = await remove(`/messages/${id}`);

      if (result) {
        // setInboxMails(inboxMails.filter(message => message.id !== id));
        // setSentMessage(sentMessage.filter(message => message.id !== id));
        // setDrafts(drafts.filter(message => message.id !== id));
        // if (message.length > 0) {
        //   setMessage(message.filter(msg => msg.id !== id));
        //   console.log("from auth", message);
        // }
        // setUnreadNotifications(prev => {
        //   const updated = new Set(prev);
        //   updated.delete(id);
        //   return updated;
        // });
        await refetchAll();
      }
      if (!result) {
        setInboxMessage(inboxMessage.filter(msg => msg.id !== id));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete message");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        drafts,
        sentMessage,
        inboxMessage,
        handleDraftMessage: (data: messageData) =>
          handleMessages(data, "draft"),
        handleSendMessage: (data: messageData) => handleMessages(data, "sent"),
        handleRemoveMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
