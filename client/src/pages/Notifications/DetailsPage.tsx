import {recv_message} from "@/contexts/AuthContext/AuthContext";
import {useGet} from "@/hooks/useApiCall";
import {MessageData} from "@/hooks/useMessages";
import {useEffect, useState} from "react";
import {FiArrowLeft, FiTrash} from "react-icons/fi";
import {useNavigate, useParams} from "react-router-dom";

type UserDetails = {
  subject: string;
  body: string;
  date: string;
};

export const DetailsPage = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const {data, loading} = useGet<MessageData | recv_message>(`/messages/${id}`);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (data && !Array.isArray(data)) {
      setUserDetails(data);
    }
  }, [data]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading</div>;
  }
  if (!userDetails) return;
  const {subject, date, body} = userDetails;

  console.log("userDetail", userDetails);

  return (
    <div className=" text-center">
      <div className="mx-auto w-1/2  my-4">
        <div className="flex gap-2 justify-center py-3">
          <button
            onClick={handleBack}
            className=" hover:transition-all ease-out duration-300 hover:scale-110 text-xl hover:bg-green-400 rounded-full p-2"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <button className="hover:transition-all ease-out duration-300 hover:scale-110 text-xl hover:bg-red-400 rounded-full p-2">
            <FiTrash className="w-6 h-6" />
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-xl">{subject}</h3>
          <span>{new Date(date).toLocaleString()}</span>
        </div>
        <br />
        <br />
        <p>{body}</p>
      </div>
    </div>
  );
};
