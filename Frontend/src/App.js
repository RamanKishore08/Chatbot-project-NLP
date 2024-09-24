import React, { useState } from 'react';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);

        const response = await fetch(' http://127.0.0.1:5000/enquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: input })
        });
        const botMessage = await response.json();

        setMessages([...messages, userMessage, { sender: 'bot', text: botMessage.answer }]);
        setInput('');
    };

    return (
        <div className="App">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />

            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
