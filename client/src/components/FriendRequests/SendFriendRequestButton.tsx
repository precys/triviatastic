import React, { useEffect, useState } from 'react'
// import axios from 'axios';
// import { useUser } from '@/hooks/useUser';
import friendsService from '@/utils/friendsService';


interface SendFriendReqButtonProps{
    senderId: string; //sender
    // receiverId: string; //receiver
    receiverUsername?: string;
    onRequestSent?: () => void; // callback checking if request was sent successfully 
}

export default function SendFriendRequestButton( { senderId, receiverUsername, onRequestSent }: SendFriendReqButtonProps) {
  console.log('Sending friend request:', { senderId, receiverUsername });
    const [reqStatus, setReqStatus ] = useState<string>("Not sent")

    const sendRequest = async () => {
        if (!receiverUsername) {
          console.error('Receiver username is undefined');
          setReqStatus('Error');
          return;
        }
        try{
            setReqStatus("sending")
            // const response = await axios.post(`http://localhost:3000/users/${senderId}/friend-requests`, { friendUsername: receiverUsername});
            // console.log('Friend request response:', response.data);
            const sendFriendReq = async () =>{
              const data = await friendsService.sendFriendReq(senderId, receiverUsername);
              console.log("friend req data", data);
              setReqStatus("sent");
            }
            sendFriendReq();
            if (onRequestSent) onRequestSent();
        }catch(error : any){
            if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Status:', error.response.status);
            } else if (error.request) {
              console.error('No response:', error.request);
            } else {
              console.error('Axios error:', error.message);
            }
            setReqStatus('Error');
        }
    };

  return (
    <button
      disabled={reqStatus === 'sending'}
      className={`px-3 py-1 rounded ${
        reqStatus === 'sending' ? 'bg-gray-400 text-black cursor-not-allowed' : 'bg-blue-600 text-black hover:bg-blue-700'
      }`}
      onClick={sendRequest}
    >
      {reqStatus === 'sending'
        ? 'Sending...'
        : reqStatus === 'sent'
        ? `Request Sent!`
        : 'Send Friend Request'}
    </button>
  );
}
