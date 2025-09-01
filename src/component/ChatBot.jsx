import React, { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const botResponses = [
    "That's a very interesting point. I'll consider that.",
    "I'm afraid I don't have a direct answer for that.",
    "Could you please clarify what you mean?",
    "I'm still learning, but I appreciate your input!",
    "Thank you for that message. It's helpful.",
  ];

  const [messages, setMessages] = useState([
    {
      text: "Hello! Ask me anything.",
      isUser: false,
      liked: false,
      disliked: false,
      feedbackText: null,
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    const newUserMessage = { text: userInput.trim(), isUser: true };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    setUserInput("");

    setTimeout(() => {
      const nextBotResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const newBotMessage = {
        text: nextBotResponse,
        isUser: false,
        liked: false,
        disliked: false,
        feedbackText: null,
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    }, 500);
  };

  // Handle like/dislike
  const handleFeedback = (index, type) => {
    setMessages((prevMessages) =>
      prevMessages.map((message, i) => {
        if (i === index) {
          const liked = type === "like" ? !message.liked : false;
          const disliked = type === "dislike" ? !message.disliked : false;
          const feedbackText = liked
            ? "You liked this message"
            : disliked
            ? "You disliked this message"
            : null;
          return { ...message, liked, disliked, feedbackText };
        }
        return message;
      })
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>Chat Bot</div>
        <div ref={chatBoxRef} style={styles.chatBox}>
          {messages.map((message, index) => (
            <div key={index} style={styles.messageWrapper}>
              <div
                style={{
                  ...styles.chatMessage,
                  ...(message.isUser ? styles.userMessage : styles.botMessage),
                }}
              >
                <p>{message.text}</p>
              </div>

              {/* Show feedback row for bot messages only */}
              {!message.isUser && (
                <div style={styles.feedbackRow}>
                  <div style={styles.feedbackButtons}>
                    <button
                      style={{
                        ...styles.feedbackButton,
                        color: message.liked ? "#10b981" : "#9ca3af",
                      }}
                      onClick={() => handleFeedback(index, "like")}
                    >
                      <i class="bi bi-hand-thumbs-up-fill"></i>
                    </button>
                    <button
                      style={{
                        ...styles.feedbackButton,
                        color: message.disliked ? "#ef4444" : "#9ca3af",
                      }}
                      onClick={() => handleFeedback(index, "dislike")}
                    >
                      <i class="bi bi-hand-thumbs-down-fill"></i>
                    </button>
                  </div>
                  {message.feedbackText && (
                    <span style={styles.feedbackText}>
                      {message.feedbackText}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input row */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            id="user-input"
            placeholder="Type your message..."
            style={styles.inputField}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            id="send-button"
            style={styles.sendButton}
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={styles.sendIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

const styles = {
  appContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "1rem",
    fontFamily: "Inter, sans-serif",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "42rem",
    height: "90vh",
    backgroundColor: "#fff",
    borderRadius: "1.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "1.5rem",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "600",
    borderTopLeftRadius: "1.5rem",
    borderTopRightRadius: "1.5rem",
  },
  chatBox: {
    flex: 1,
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    overflowY: "auto",
  },
  messageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.25rem",
  },
  chatMessage: {
    maxWidth: "75%",
    padding: "0.75rem",
    borderRadius: "1rem",
  },
  userMessage: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    alignSelf: "flex-start",
  },
  feedbackRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.75rem",
    marginLeft: "0.5rem",
  },
  feedbackButtons: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  feedbackButton: {
    fontSize: "1.25rem",
    cursor: "pointer",
    transition: "color 200ms ease-in-out",
    background: "transparent",
    border: "none",
  },
  feedbackText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontStyle: "italic",
  },
  inputContainer: {
    padding: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: "1.5rem",
    borderBottomRightRadius: "1.5rem",
  },
  inputField: {
    flex: 1,
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "9999px",
    outline: "none",
    transition: "all 200ms ease-in-out",
  },
  sendButton: {
    marginLeft: "1rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "0.75rem",
    borderRadius: "9999px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "background-color 200ms ease-in-out",
    border: "none",
    cursor: "pointer",
  },
  sendIcon: {
    height: "1.5rem",
    width: "1.5rem",
    transform: "rotate(90deg)", // right direction
  },
};
