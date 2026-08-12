import { useEffect, useState } from "react";

const ChatRoom = ({ username, room, socket, onLeave }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const receiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      text: message,
      room,
      username,
    };

    socket.emit("send", newMessage);

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="chatroom-wrapper">
      <div className="chatroom-container">

        {/* WhatsApp Style Header */}
        <div className="chatroom-header">

          <div className="chat-header-left">

            <div className="group-avatar">
              <div className="avatar-circle">
                <span className="avatar-initial">
                  {room.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="chat-header-info">
              <h2>{room}</h2>
              <p>
                <span className="online-dot"></span>
                Online • Realtime Chat
              </p>
            </div>

          </div>

          <button className="leave-btn" onClick={onLeave}>
            Leave
          </button>

        </div>

        {/* Messages */}
        <div className="chat-messages">

          {messages.length === 0 ? (
            <div className="empty-message">
              <div className="empty-icon">💬</div>
              <strong>No messages yet</strong>
              <span>Start chatting with your group!</span>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-row ${
                  msg.username === username ? "message-row-own" : ""
                }`}
              >

                <div
                  className={`chat-message ${
                    msg.username === username ? "own" : ""
                  }`}
                >

                  {msg.username !== username && (
                    <div className="chat-username">
                      {msg.username}
                    </div>
                  )}

                  <div className="message-text">
                    {msg.text}
                  </div>

                </div>

              </div>
            ))
          )}

        </div>

        {/* WhatsApp Style Input */}
        <form className="chat-input-form" onSubmit={handleSend}>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
          />

          <button type="submit" className="send-btn">
            ➤
          </button>

        </form>

        {/* Simple Footer */}
        <div className="chat-footer">
          <span>🔒</span>
          <span>Messages are sent in realtime</span>
        </div>

      </div>
    </div>
  );
};

export default ChatRoom;