import {useGet, usePost} from "@/hooks/useApiCall";
import {MessageData} from "@/hooks/useMessages";
import {useEffect, useState} from "react";
import {HiOutlineArrowNarrowLeft} from "react-icons/hi";
import {GoReply} from "react-icons/go";
import {FaRegTrashAlt, FaReply} from "react-icons/fa";
import {useNavigate, useParams} from "react-router-dom";
import boy from "../../assets//boy.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import {useAuthContext} from "@/hooks/useAuth";
import toast from "react-hot-toast";

type replyMessage = {
  id: string;
  parentId?: string;
  subject: string;
  body: string;
  date: string | Date;
  sender: string;
  receivers?: (string | string[] | undefined)[];
};

export const DetailsPage = () => {
  const {register, handleSubmit} = useForm<{
    body: string;
    subject: string;
  }>();
  const {user} = useAuthContext();
  const navigate = useNavigate();
  const {id} = useParams();
  const {post} = usePost<replyMessage>(`/messages/${id}`);
  const {data, loading} = useGet(`/messages/${id}`);
  const [messageDetails, setMessageDetails] = useState<replyMessage[]>([]);
  const [logedUser, setLoggedUser] = useState<string | null>(null);
  const [parentMessage, setParentMessage] = useState<MessageData | null>(null);

  useEffect(() => {
    if (typeof user === "string") {
      setLoggedUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setMessageDetails(data);
      const filterParent = data.find(msg => msg.id === id);
      setParentMessage(filterParent);
    }
  }, [data, id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (!parentMessage) return;
  const {receivers, sender} = parentMessage;

  const filterReceivers = receivers.filter(usr => usr !== logedUser);

  const onSubmit = async (data: {body: string; subject: string}) => {
    const involvedUsers = [filterReceivers, sender];
    const replyMessage = {
      id: uuidv4(),
      parentId: id,
      subject: data.subject,
      body: data.body,
      date: new Date(),
      sender: typeof user === "string" ? user : "defaultUser",
      receivers: involvedUsers,
      status: "reply",
      involvedUsers,
    };
    if (replyMessage) {
      const response = await post(replyMessage);
      if (response) {
        toast.success("Hey Thank You");
      }
      setMessageDetails(prev => [replyMessage, ...prev]);
    }
  };

  return (
    <div className="h-[500px] overflow-y-auto scroll-bar">
      {messageDetails.map(detail => (
        <div key={detail.id} className="m-3 p-2">
          <div className="flex py-3">
            <button
              onClick={handleBack}
              className=" hover:bg-green-400 rounded-full p-1"
            >
              <HiOutlineArrowNarrowLeft />
            </button>
            <button className=" hover:bg-red-400 rounded-full p-1">
              <FaRegTrashAlt />
            </button>
            <Dialog modal={false}>
              <DialogTrigger asChild>
                <button className=" hover:bg-green-400 rounded-full p-1">
                  <GoReply />
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogTitle className="my-3">Reply</DialogTitle>

                  <DialogDescription />
                  <div>
                    <Label className="font-semibold text-md text-slate-400">
                      Subject
                    </Label>
                    <Input className="mt-2" {...register("subject")} />
                  </div>
                  <div>
                    <Label
                      htmlFor="username"
                      className="font-semibold text-md text-slate-400"
                    >
                      body
                    </Label>
                    <Textarea
                      className="my-2"
                      placeholder="Type your message here."
                      {...register("body")}
                    />
                  </div>

                  <DialogFooter>
                    <>
                      <Button
                        // onClick={() =>s
                        //   handleReplyMessage({
                        //     subject: watchSubject,
                        //     body: watchBody,

                        //   })
                        // }
                        className="flex items-center gap-2 font-semibold text-md rounded-none rounded-r-full"
                      >
                        <FaReply />
                        <span>Reply</span>
                      </Button>
                    </>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <h3 className="font-semibold text-2xl">{detail.subject}</h3>
          <span className="text-slate-500 text-sm">
            {new Date(detail.date).toLocaleString()}
          </span>

          <div className="flex justify-between mt-4">
            <div>
              <p className="font-bold text-slate-400">From</p>
              <span className="text-green-600">{detail.sender}</span>
              <img className="w-8 h-8" src={boy} />
            </div>
            <div>
              <p className="font-bold text-slate-400">To</p>
              <div className="flex gap-1">
                {detail.receivers?.map((usr, index) => (
                  <div key={index}>
                    <span>{usr}</span>
                    <img className="w-8 h-8" src={boy} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <br />
          <pre
            className="w-4/5 whitespace-pre-wrap
        "
          >
            {detail.body}
          </pre>
        </div>
      ))}
    </div>
  );
};
