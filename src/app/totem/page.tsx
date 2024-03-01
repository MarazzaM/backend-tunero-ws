"use client"
import React, { useState, useEffect, useRef } from 'react';
import createSocket from '@/lib/websocket';
import { Button } from "@/components/ui/button";
import { useReactToPrint } from 'react-to-print';

const CTAButton = ({ children, onClick, color }) => {
  let buttonColorClasses = "";
  if (color === "green") {
    buttonColorClasses = "bg-green-500 hover:bg-green-600";
  } else if (color === "blue") {
    buttonColorClasses = "bg-blue-500 hover:bg-blue-600";
  }

  return (
    <Button
      onClick={onClick}
      className={`text-white h-auto text-9xl font-semibold py-8 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ${buttonColorClasses}`}
    >
      {children}
    </Button>
  );
};

function Page() {
  const [socket, setSocket] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  const [messageNumber, setMessageNumber] = useState(null);
  const [messageType, setMessageType] = useState(null);
  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    // Attach event listener only if socket is not null
    if (newSocket) {
      newSocket.on('message', (message) => {
        console.log(`Received Socket.io message` + message.number);
        setMessageSent(true);
        setMessageNumber(message.number)
        setMessageType(message.type)
        setTimeout(() => {
          setMessageSent(false);
        }, 3000); // Hide the success component after 3 seconds
      });
    }

    return () => {
      // Cleanup socket connection when the component unmounts
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  function handleNormal() {
    if (socket) {
      // Emit the 'generateTicket' event with the hardcoded type
 const type = "hardcodedType"; // Default value or retrieve it from somewhere
socket.emit('generateTicket', { type }, (response) => {
  // Handle the response from the server if needed
  console.log('Response from server:', response);
});

    }
  }
  

  function handlePriority(){
    if (socket) {
      const type = "priority";
      socket.emit("message", { type, number: "P-2" }, (response) => {
      });
    }
  }

  function closeModal(){
    setMessageSent(false);
  }

  const SuccessComponent = ({ number, type }) => {
    const printComponentRef = useRef(null);
    const handlePrint = useReactToPrint({
      content: () => printComponentRef.current,
    });
  
    setTimeout(() => {
      handlePrint()
    }, 100);
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-50 text-black flex-col">
        <div ref={printComponentRef} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center ">{number}</div>
          <div>Type: {type}</div>
        </div>
        <Button onClick={closeModal} className='mt-4 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300'>Close</Button>
      </div>
    );
  };

  return (
    <div className="flex flex-row gap-8 justify-center items-center flex-grow">
      {messageSent && <SuccessComponent number={messageNumber} type={messageType} />}
      <CTAButton onClick={handleNormal} color="green">
        Normal
      </CTAButton>
      <CTAButton onClick={handlePriority} color="blue">
        Priority
      </CTAButton>
    </div>
  );
}

export default Page;
