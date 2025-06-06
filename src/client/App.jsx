import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    let ws;

    if (typeof window !== 'undefined' && 'WebSocket' in window) {
      ws = new window.WebSocket('ws://localhost:3000');
      socketRef.current = ws;
    } else {
      // eslint-disable-next-line no-console
      console.error('WebSocket is not available in this environment.');

      return;
    }

    ws.onopen = () => {
      const name = window.prompt('Enter your name:');

      setUsername(name);
      ws.send(JSON.stringify({ type: 'set_username', username: name }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (
        data.type === 'message' &&
        typeof data.text === 'string' &&
        typeof data.author === 'string' &&
        typeof data.time === 'string'
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => {
      // eslint-disable-next-line no-console
      console.log('Disconnected from server');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = () => {
    if (
      input.trim() !== '' &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(JSON.stringify({ type: 'message', text: input }));
      setInput('');
    }
  };

  return (
    <div>
      <h1>Simple Chat</h1>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.author}</strong> [{msg.time}]: {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
