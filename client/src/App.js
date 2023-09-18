import { useState } from "react";
import Chat from "./Chat";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000");

function App() {
   const [username, setUsername] = useState("");
   const [room, setRoom] = useState("");
   const [showChat, setShowChat] = useState(false);

   const joinRoom = () => {
      if (username !== "" && room !== "") {
         socket.emit("join_room", room);
         setShowChat(true);
      }
   };

   return (
      <div className="App">
         {!showChat ? (
            //if showChat is false, show the upper chat portion only
            <div className="joinChatContainer">
               <h3>HelloChat 💬</h3>
               <input
                  type="text"
                  placeholder="John..."
                  onChange={(event) => {
                     setUsername(event.target.value);
                  }}
               />
               <input
                  type="text"
                  placeholder="Room ID..."
                  onChange={(event) => {
                     setRoom(event.target.value);
                  }}
               />
               <button onClick={joinRoom}>Join A Room</button>
            </div>
         ) : (
            //if true, show live Chat section.
            <Chat socket={socket} username={username} room={room} />
         )}
      </div>
   );
}

export default App;
