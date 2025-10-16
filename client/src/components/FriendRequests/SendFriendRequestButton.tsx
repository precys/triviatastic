import { useEffect, useState } from 'react'
import friendsService from '@/utils/friendsService';


interface SendFriendReqButtonProps{
    senderId: string; //sender
    receiverUsername?: string;
    onRequestSent?: () => void; // callback checking if request was sent successfully 
}

export default function SendFriendRequestButton( { senderId, receiverUsername, onRequestSent }: SendFriendReqButtonProps) {
  console.log('Sending friend request:', { senderId, receiverUsername });
  const [reqStatus, setReqStatus ] = useState<"not_sent" | "pending" | "sent" | "denied" | "error">("not_sent");
  const [loadingStatus, setLoadingStatus] = useState(true);

    useEffect(() => {
      if (!receiverUsername) {
          console.error('Receiver username is undefined');
          setReqStatus('error');
          return;
      }

      const checkStatus = async () => {
        setLoadingStatus(true);
        try{
          const status = await friendsService.getFriendRequestsStatus(senderId, receiverUsername);
          switch(status) {
            case "pending":
                setReqStatus("pending");
                break;
            case "accepted":
                setReqStatus("sent");
                break;
            case "denied":
                setReqStatus("denied");
                break;
            default:
                setReqStatus("not_sent");
          }
        }catch(err){
            console.error("Error fetching friend request status:", err);
            setReqStatus("error");
        }finally {
          setLoadingStatus(false);
        }
      };
      checkStatus();
    }, [senderId, receiverUsername])

    const sendRequest = async () => {
      if (!receiverUsername) {
          console.error('Receiver username is undefined');
          setReqStatus('error');
          return;
      }

      if (reqStatus === "pending" || reqStatus === "sent") return; //ensure no duplicate requests are sent

      setLoadingStatus(true);
      setReqStatus("pending");

      try{
        const sendFriendReq = async () =>{
          const data = await friendsService.sendFriendReq(senderId, receiverUsername);
          console.log("friend req data", data);
          switch (data.status) {
            case "pending":
              setReqStatus("pending");
              break;
            case "accepted":
              setReqStatus("sent");
              break;
            case "denied":
              setReqStatus("denied");
              break;
            default:
              setReqStatus("pending");
          }
          setLoadingStatus(false);
        }
        sendFriendReq();
        if (onRequestSent) onRequestSent();
      }catch(err){
        console.error("Error sending friend request:", err);
        setReqStatus("error");
      }
    };

  return (
    <button
      disabled={loadingStatus || reqStatus === "pending" || reqStatus === "sent"}
      className={`btn btn-primary btn-sm rounded-pill px-3 py-2 shadow-sm ${
        loadingStatus || reqStatus === "pending" || reqStatus === "sent"
          ? "disabled btn-secondary"
          : ""
      }`}
      onClick={sendRequest}
    >
      {loadingStatus
        ? "Checking..."
        : reqStatus === "pending"
        ? "Request Pending"
        : reqStatus === "sent"
        ? "Sent"
        : reqStatus === "denied"
        ? "Send Again"
        : "Send Friend Request"}
    </button>
  );
}
