"use client";
import React, { useState, useEffect, useRef } from "react";
import createSocket from "@/lib/websocket";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import useSWR from "swr";

const CTAButton = ({ children, onClick, color, colorBg }) => {
  const buttonStyle = {
    backgroundColor: `${colorBg}`,
    color: `${color}`,
  };

  return (
    <Button
      onClick={onClick}
      style={buttonStyle}
      className="h-auto text-9xl font-semibold py-8 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
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

  const backend = process.env.NEXT_PUBLIC_BACKEND;
  const apiUrl = `${backend}/tipo-atencion/active`;
  const fetcher = async (url, token) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  };
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    // Attach event listener only if socket is not null
    // if (newSocket) {
    //   newSocket.on("generatedTicket", (message) => {
    //     console.log(`Received Socket.io message` + message.number);
    //     setMessageSent(true);
    //     setMessageNumber(message.number);
    //     setMessageType(message.type);
    //     setTimeout(() => {
    //       setMessageSent(false);
    //     }, 3000); // Hide the success component after 3 seconds
    //   });
    // }

    return () => {
      // Cleanup socket connection when the component unmounts
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  function handleGenerateTicket(type: string, priority: number) {
    if (socket) {
      socket.emit("generateTicket", { type, priority }, (response) => {
        // Handle the response from the server if needed
        console.log("Response from server:", response);
        if(response != "No more people in queue"){
          setMessageSent(true);
          setMessageNumber(response.number);
          setMessageType(response.type);  
          setTimeout(() => {
            setMessageSent(false);
          }, 3000); // Hide the success component after 3 seconds
        }
      });
    }
  }

  function closeModal() {
    setMessageSent(false);
  }

  const SuccessComponent = ({ number, type }) => {
    const printComponentRef = useRef(null);
    const handlePrint = useReactToPrint({
      content: () => printComponentRef.current,
    });

    setTimeout(() => {
      handlePrint();
    }, 100);
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-50 text-black flex-col">
        <div
          ref={printComponentRef}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="text-center ">{number}</div>
          <div>Type: {type}</div>
        </div>
        <Button
          onClick={closeModal}
          className="mt-4 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
        >
          Close
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-row gap-8 justify-center items-center flex-grow">
      {messageSent && (
        <SuccessComponent number={messageNumber} type={messageType} />
      )}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        data.map((item) => (
          <CTAButton
          key={item.id}
          onClick={() => handleGenerateTicket(item.type, item.priority)} // Handle the click event for each button
          color={item.color}
          colorBg={item.colorBg}
        >
          {item.type}
        </CTAButton>
        ))
      )}
    </div>
  );
}

export default Page;
