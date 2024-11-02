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
  refetchInbox: () => Promise<void>;
  hide: boolean;
  setHide: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotificationContext = createContext<NotificationProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {
    user,
    message,
    draftMessage,
    sendMsg,
    socket,
    messageId,
    setMessageId,
  } = useAuthContext();
  const {post} = usePost("/messages");
  const {remove} = useDelete();
  const {draftMessages, inboxMessages, sentMessages, refetchAll, refetchInbox} =
    useMessages(user);
  const [drafts, setDrafts] = useState<MessageData[]>([]);
  const [sentMessage, setSentMessage] = useState<MessageData[]>([]);
  const [inboxMessage, setInboxMessage] = useState<recv_message[]>([]);
  const [hide, setHide] = useState<boolean>(false);

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
    if (draftMessage) {
      setDrafts(prevMessages => [draftMessage, ...prevMessages]);
    }
  }, [draftMessage]);

  useEffect(() => {
    if (sentMessages) {
      setSentMessage(sentMessages.filter(message => message.status === "sent"));
    }
  }, [sentMessages]);

  useEffect(() => {
    if (sendMsg) {
      setSentMessage(prevMessages => [sendMsg, ...prevMessages]);
    }
  }, [sendMsg]);

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
    if (status === "draft") {
      socket.emit("draft_message", message);
    }
    const response = await post(message);
    if (response) {
      if (status === "sent") {
        toast.success("Send Message Successfully");
        await refetchInbox();
      }
      if (status === "draft") {
        toast.success("Save Message Successfully");
      }
    }
  };

  socket.on("delete_message", (msg: {id: string}) => {
    setInboxMessage(inboxMessage.filter(msgId => msgId.id !== msg.id));
    setDrafts(drafts.filter(msgId => msgId.id !== msg.id));
    setSentMessage(sentMessage.filter(msgId => msgId.id !== msg.id));
  });

  const handleRemoveMessage = async (id: string) => {
    if (messageId) {
      setMessageId(messageId?.filter(msgId => msgId !== id));
    }
    try {
      const result = await remove(`/messages/${id}`);
      if (result) {
        socket.emit("delete_message", {id});
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
        refetchInbox,
        handleDraftMessage: (data: messageData) =>
          handleMessages(data, "draft"),
        handleSendMessage: (data: messageData) => handleMessages(data, "sent"),
        handleRemoveMessage,
        hide,
        setHide,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
