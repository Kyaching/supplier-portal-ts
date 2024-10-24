import {useState, useEffect} from "react";
import {useGet} from "./useApiCall";

export interface MessageData {
  status: string;
  id: string;
  sender: string;
  receivers: string[];
  date: string;
  subject: string;
  body: string;
}

const useMessages = (user: string | string[] | null) => {
  const [sentMessages, setSentMessages] = useState<MessageData[]>([]);
  const [draftMessages, setDraftMessages] = useState<MessageData[]>([]);
  const [inboxMessages, setInboxMessages] = useState<MessageData[]>([]);

  const {data: sentData, get: refetchSent} = useGet(`/messages/sent/${user}`);
  const {data: draftData, get: refetchDraft} = useGet(
    `/messages/draft/${user}`
  );
  const {data: inboxData, get: refetchInbox} = useGet(
    `/messages/inbox/${user}`
  );

  useEffect(() => {
    if (Array.isArray(sentData)) setSentMessages(sentData);
    if (Array.isArray(draftData)) setDraftMessages(draftData);
    if (Array.isArray(inboxData)) setInboxMessages(inboxData);
  }, [sentData, draftData, inboxData]);

  const refetchAll = async () => {
    await Promise.all([refetchSent(), refetchDraft(), refetchInbox()]);
  };

  return {
    sentMessages,
    draftMessages,
    inboxMessages,
    refetchInbox,
    refetchAll,
    refetchSent,
    refetchDraft,
  };
};

export default useMessages;
