"use client"
import React, { useState, useEffect } from 'react';
import createSocket from '@/lib/websocket';

function Page() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    return () => {
      // Cleanup socket connection when the component unmounts
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const sendMessage = () => {
    if (socket) {
      const type = "test";
      socket.emit("message", { type, number: "A-2" });
    }
  };

  return (
    <div>
      <p>page</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default Page;
