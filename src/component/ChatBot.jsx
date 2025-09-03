import React, { useState, useEffect, useRef } from "react";
import "../plugins/custom_css/chatbot.css";

const ChatBot = () => {
  const botResponses = [
    "That's a very interesting point. I'll consider that.",
    "I'm afraid I don't have a direct answer for that.",
    "Could you please clarify what you mean?",
    "I'm still learning, but I appreciate your input!",
    "Thank you for that message. It's helpful.",
  ];

  const welcomeMessages = [
    "Hey! Ask me anything.",
    "How may I help you?",
    "Hello there! What's on your mind?",
    "Hi! Ready to chat.",
    "What can I do for you?",
  ];

  const emojis = [
    "😀",
    "😂",
    "🥰",
    "👍",
    "🙏",
    "❤️",
    "🎉",
    "🔥",
    "💯",
    "🤯",
    "🚀",
    "💡",
    "🤔",
  ];

  const [messages, setMessages] = useState([]);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState(""); // Store the welcome message
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [matchedIndices, setMatchedIndices] = useState([]); // Array of indices for matches
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1); // Index of the current match
  const [showScrollDownButton, setShowScrollDownButton] = useState(false); // State for scroll down button
  const chatBoxRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const emojiButtonRef = useRef(null);
  const messageRefs = useRef([]); // Ref for each message element

  // Set welcome message only once when component mounts
  useEffect(() => {
    setWelcomeMessage(
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
    );
  }, []);

  // Handle scroll detection for scroll down button
  useEffect(() => {
    const chatBox = chatBoxRef.current;

    const handleScroll = () => {
      if (!chatBox) return;

      const { scrollTop, scrollHeight, clientHeight } = chatBox;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

      setShowScrollDownButton(!isNearBottom && messages.length > 0);
    };

    if (chatBox) {
      chatBox.addEventListener("scroll", handleScroll);
      return () => chatBox.removeEventListener("scroll", handleScroll);
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Highlight matches and scroll to the current one
  useEffect(() => {
    if (currentMatchIndex !== -1 && messageRefs.current[currentMatchIndex]) {
      messageRefs.current[currentMatchIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentMatchIndex]);

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    setShowInitialMessage(false);

    const newUserMessage = { text: userInput.trim(), isUser: true };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput("");
    setShowEmojiPicker(false);

    setIsLoading(true);
    const loadingMessage = {
      text: (
        <>
          <span className="bouncing-dots" style={{ "--delay": "0s" }}>
            •
          </span>
          <span className="bouncing-dots" style={{ "--delay": "0.2s" }}>
            •
          </span>
          <span className="bouncing-dots" style={{ "--delay": "0.4s" }}>
            •
          </span>
        </>
      ),
      isUser: false,
      isLoading: true,
    };
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

    setTimeout(() => {
      const nextBotResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const newBotMessage = {
        text: nextBotResponse,
        isUser: false,
        liked: false,
        disliked: false,
        feedbackText: null,
        showFeedback: true,
      };

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter(
          (message) => !message.isLoading
        );
        return [...updatedMessages, newBotMessage];
      });
      setIsLoading(false);
    }, 500);
  };

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

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emoji) => {
    setUserInput((prevInput) => prevInput + emoji);
  };

  // Search logic
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setMatchedIndices([]);
      setCurrentMatchIndex(-1);
      return;
    }
    const matches = messages
      .map((message, index) =>
        message.text &&
        typeof message.text === "string" &&
        message.text.toLowerCase().includes(term.toLowerCase())
          ? index
          : null
      )
      .filter((index) => index !== null);
    setMatchedIndices(matches);
    if (matches.length > 0) {
      setCurrentMatchIndex(matches[0]);
    } else {
      setCurrentMatchIndex(-1);
    }
  };

  const handleNextMatch = () => {
    if (matchedIndices.length > 0) {
      const currentIndex = matchedIndices.indexOf(currentMatchIndex);
      const nextIndex = (currentIndex + 1) % matchedIndices.length;
      setCurrentMatchIndex(matchedIndices[nextIndex]);
    }
  };

  const handlePreviousMatch = () => {
    if (matchedIndices.length > 0) {
      const currentIndex = matchedIndices.indexOf(currentMatchIndex);
      const prevIndex =
        (currentIndex - 1 + matchedIndices.length) % matchedIndices.length;
      setCurrentMatchIndex(matchedIndices[prevIndex]);
    }
  };

  const handleScrollDown = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      setShowScrollDownButton(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="header">Chat Bot</div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search chat..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {matchedIndices.length > 0 && (
            <div className="search-controls">
              <span>
                {matchedIndices.indexOf(currentMatchIndex) + 1} of{" "}
                {matchedIndices.length}
              </span>
              <button onClick={handlePreviousMatch}>▲</button>
              <button onClick={handleNextMatch}>▼</button>
            </div>
          )}
        </div>
        <div
          ref={chatBoxRef}
          className="chat-box"
          style={{ position: "relative" }}
        >
          {showInitialMessage && (
            <div className="initial-message-wrapper">
              <div className="chat-message initial-message">
                <p>{welcomeMessage}</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${
                matchedIndices.includes(index) ? "highlighted-message" : ""
              } ${
                index === currentMatchIndex ? "current-highlighted-message" : ""
              }`}
              ref={(el) => (messageRefs.current[index] = el)}
            >
              <div
                className={`chat-message ${
                  message.isUser ? "user-message" : "bot-message"
                } ${message.isLoading ? "loading-message" : ""}`}
              >
                {message.isLoading ? message.text : <p>{message.text}</p>}
              </div>
              {!message.isUser && message.showFeedback && (
                <div className="feedback-row">
                  <div className="feedback-buttons">
                    <button
                      className={`feedback-button ${
                        message.liked ? "liked" : ""
                      }`}
                      onClick={() => handleFeedback(index, "like")}
                    >
                      <i className="bi bi-hand-thumbs-up-fill"></i>
                    </button>
                    <button
                      className={`feedback-button ${
                        message.disliked ? "disliked" : ""
                      }`}
                      onClick={() => handleFeedback(index, "dislike")}
                    >
                      <i className="bi bi-hand-thumbs-down-fill"></i>
                    </button>
                  </div>
                  {message.feedbackText && (
                    <span className="feedback-text">
                      {message.feedbackText}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          {showScrollDownButton && (
            <button
              className="scroll-down-button"
              onClick={handleScrollDown}
              style={{
                position: "fixed",
                bottom: "166px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#0056b3";
                e.target.style.transform = "translateX(-50%) translateY(-2px)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#007bff";
                e.target.style.transform = "translateX(-50%) translateY(0)";
                e.target.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
        </div>
        <div className="input-container">
          <div className="emoji-picker-container">
            {showEmojiPicker && (
              <div className="emoji-picker">
                {emojis.map((emoji, index) => (
                  <span
                    key={index}
                    className="emoji-button"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
            <button
              ref={emojiButtonRef}
              className="emoji-toggle-button"
              onClick={handleToggleEmojiPicker}
            >
              😊
            </button>
          </div>
          <input
            type="text"
            id="user-input"
            placeholder="Type your message..."
            className="input-field"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            id="send-button"
            className="send-button"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="send-icon"
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
