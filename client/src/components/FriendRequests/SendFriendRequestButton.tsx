import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '@/hooks/useUser';


interface SendFriendReqButtonProps{
    senderId: string; //sender
    receiverId: string; //receiver
    receiverUsername?: string;
    onSuccess?: () => void; // callback checking if request was sent successfully 
}

export default function SendFriendRequestButton( { senderId, receiverId, receiverUsername, onSuccess, }: SendFriendReqButtonProps) {
    const [reqStatus, setReqStatus ] = useState<string>("Not sent")

    const sendRequest = async () => {
        if (!receiverUsername) {
          console.error('Receiver username is undefined');
          setReqStatus('Error');
          return;
        }
        try{
            setReqStatus("sending")
            const response = await axios.post(`http://localhost:3000/users/${senderId}/friend-requests`, { friendUsername: receiverUsername});
            console.log('Friend request response:', response.data);
            setReqStatus("sent")
            if (onSuccess) onSuccess();
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
