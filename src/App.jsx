import { useEffect, useState } from "react";
import ChatRoom from "./components/ChatRoom";
import "./App.css";
import { io } from "socket.io-client";

const SOCKET_URL = "https://chatbackend-production-631a.up.railway.app";

let socket;

function App() {
  const [joined, setJoined] = useState(false);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !room.trim()) {
      return;
    }

    socket.emit("join", room);

    setJoined(true);
  };

  const handleLeave = () => {
    setUsername("");
    setRoom("");
    setJoined(false);
  };

  return (
    <>
      {!joined ? (
        <div className="join-group-container">
          <h2>Join a Chat Group</h2>

          <form className="join-group-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Group Name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />

            <button type="submit">Join</button>
          </form>
        </div>
      ) : (
        <ChatRoom
          username={username}
          room={room}
          socket={socket}
          onLeave={handleLeave}
        />
      )}
    </>
  );
}

export default App;