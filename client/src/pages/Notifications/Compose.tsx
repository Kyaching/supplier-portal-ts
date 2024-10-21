import {Option} from "@/components/Option";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {FiInbox, FiPaperclip, FiSend} from "react-icons/fi";
import {LuMailPlus} from "react-icons/lu";
import {PopOverSelect} from "./PopOverSelect";
import {useState} from "react";

export const Compose = () => {
  // const {
  //   handleDraft,
  //   drafts,
  //   handleSend,
  //   sentMails,
  //   inboxMails,
  //   selectedUsers,
  // } = useContext(MailContext);
  const {register, handleSubmit, watch} = useForm();
  const watchSubject = watch("subject");
  const watchBody = watch("body");
  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const optionData = [
    {
      id: 1,
      icon: <FiInbox className="w-6 h-6" />,
      name: "Inbox",
      // count: inboxMails?.length,
      count: 1,
      to: "inbox",
    },
    {
      id: 2,
      icon: <FiSend className="w-6 h-6" />,
      name: "Sent",
      // count: sentMails?.length,
      count: 1,
      to: "sent",
    },
    {
      id: 3,
      icon: <FiPaperclip className="w-6 h-6" />,
      name: "Draft",
      // count: drafts?.length,
      count: 1,
      to: "draft",
    },
  ];

  const onSubmit = data => {
    console.log(data);
  };
  return (
    <div className="relative">
      <>
        {optionData.map(option => (
          <Option
            key={option.id}
            icon={option?.icon}
            name={option?.name}
            count={option?.count}
            to={option?.to}
          />
        ))}
      </>

      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button className="absolute mt-80">
            <LuMailPlus className="w-6 h-6 mr-2" />
            Compose
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle className="my-3">New Message</DialogTitle>
            <PopOverSelect value={selectedUser} setValue={setSelectedUser} />
            <DialogDescription />
            <div>
              <Label className="font-semibold text-md">Subject</Label>
              <Input className="mt-2" {...register("subject")} />
            </div>
            <div>
              <Label htmlFor="username" className="font-semibold text-md">
                Body
              </Label>
              <Textarea
                className="my-2"
                placeholder="Type your message here."
                {...register("body")}
              />
            </div>

            <DialogFooter>
              {watchSubject && watchBody && selectedUser.length > 0 && (
                <>
                  <Button
                    type="submit"
                    // onClick={() =>
                    //   handleDraft({subject: watchSubject, body: watchBody})
                    // }
                    className="flex items-center gap-2 font-semibold text-md rounded-none rounded-l-full"
                  >
                    <FiPaperclip />
                    <span>Draft</span>
                  </Button>
                  <Button
                    // onClick={() =>
                    //   handleSend({subject: watchSubject, body: watchBody})
                    // }
                    className="flex items-center gap-2 font-semibold text-md rounded-none rounded-r-full"
                  >
                    <FiSend />
                    <span>Sent</span>
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
