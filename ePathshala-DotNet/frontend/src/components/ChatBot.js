import React, { useState } from 'react';
import api from '../api/axiosConfig';
import './ChatBot.css';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me something about your college life 👋' }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await api.post('/chatbot/query', { question: input });
      const botReply = { sender: 'bot', text: res.data };
      setMessages(prev => [...prev, botReply]);
    } catch {
      const botReply = { sender: 'bot', text: "Something went wrong. Try again later." };
      setMessages(prev => [...prev, botReply]);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <strong>Student ERP Chatbot</strong>
            <button onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask something..." />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
