import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
   const [currentMessage, setCurrentMessage] = useState("");
   const [messageList, setMessageList] = useState([]);

   const sendMessage = async () => {
      //make this async so that we wait for message to be sent to update our array because we wait for this to be done to continue moving forward.
      if (currentMessage !== "") {
         const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
               new Date(Date.now()).getHours() +
               ":" +
               new Date(Date.now()).getMinutes(),
         };
         await socket.emit("send_message", messageData);
         setMessageList((list) => [...list, messageData]);
         setCurrentMessage("");
      }
   };
   //below will listen everytime socket changes
   useEffect(() => {
      socket.on("receive_message", (data) => {
         setMessageList((list) => [...list, data]);
      });
   }, [socket]);

   return (
      <div className="chat-window">
         <div className="chat-header">
            <p>Live Chat</p>
         </div>
         <div className="chat-body">
            <ScrollToBottom className="message-container">
               {messageList.map((messageContent) => {
                  return (
                     <div
                        className="message"
                        id={
                           username === messageContent.author ? "you" : "other"
                        }
                     >
                        <div>
                           <div className="message-content">
                              <p>{messageContent.message}</p>
                           </div>
                           <div className="message-meta">
                              <p id="time">{messageContent.time}</p>
                              <p id="author">{messageContent.author}</p>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </ScrollToBottom>
         </div>
         <div className="chat-footer">
            <input
               type="text"
               value={currentMessage}
               placeholder="Hey.."
               onChange={(event) => {
                  setCurrentMessage(event.target.value);
               }}
               onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
               }}
            />
            <button onClick={sendMessage}>⚡</button>
         </div>
      </div>
   );
}

export default Chat;
