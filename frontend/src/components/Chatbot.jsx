// src/components/Chatbot.jsx
import React, { useState } from 'react';
import { BsRobot } from 'react-icons/bs';
import axios from 'axios';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I help you with your tasks today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/localchat', {
        prompt: input
      });

      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Local chatbot error:', err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "Sorry, I couldn't respond right now." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Highlighted Chatbot Icon */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(0, 225, 255, 0.93)',
          zIndex: 9999,
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 0 18px rgba(0, 123, 255, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 123, 255, 0.6)';
        }}
        onClick={() => setOpen(!open)}
      >
        <BsRobot size={30} />
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '350px',
            maxHeight: '450px',
            backgroundColor: '#111827',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: '#e5e7eb',
          }}
        >
          {/* Header */}
          <div style={{ padding: '10px', background: '#1f2937', color: '#fff' }}>
            <strong>AI Task Assistant</strong>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '10px',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '15px',
                    background: msg.role === 'user' ? '#374151' : '#4b5563',
                    color: '#f9fafb',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: '#9ca3af' }}>⏳ Thinking...</div>}
          </div>

          {/* Input Field */}
          <div style={{ padding: '10px', borderTop: '1px solid #374151' }}>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                backgroundColor: '#1f2937',
                color: '#f9fafb',
              }}
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
