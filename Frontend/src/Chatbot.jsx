import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { Bot, Mic, Smile } from "lucide-react"; 
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "Wait for 30-40 seconds to connect to the API.", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setIsWaiting(true);
  
    try {
      const response = await fetch("https://chatbot-api-2-bdci.onrender.com/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
  
      console.log("Raw Response:", response);
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      console.log("Response JSON:", data);
  
      setMessages((prev) => [...prev, { text: data.answer || "No response", sender: "bot" }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { text: "API connection failed", sender: "bot" }]);
    } finally {
      setIsWaiting(false);
    }
  };
  
  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2 className="chat-header">
          <Bot size={28} /> Chatbot
        </h2>
        <div className="chat-messages" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <p key={index} className={`chat-message ${msg.sender}`}>{msg.text}</p>
          ))}
          {isWaiting && <p className="chat-message bot typing-animation">...</p>}  
        </div>
        <div className="chat-input-container">
          <button className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile size={22} />
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={(e) => setInput(input + e.emoji)} />
            </div>
          )}
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="mic-button" onClick={startListening}>
            <Mic size={22} />
          </button>
          <button className="chat-send" onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
