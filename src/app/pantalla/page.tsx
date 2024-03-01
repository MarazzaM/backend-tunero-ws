"use client"

import React, { useState, useEffect } from 'react';
import createSocket from '@/lib/websocket'; // Import your WebSocket utility
import Image from 'next/image'
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('./clock'), { ssr: false });

function Page() {
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [isPulsing, setIsPulsing] = useState(false);


  useEffect(() => {
    const socket = createSocket(); // Create WebSocket connection
    socket.on('calledAppointment', (appointmentInfo) => {
      // console.log(appointmentInfo);
  
      // Check if appointmentInfo has all the required fields
      if (
        appointmentInfo &&
        appointmentInfo.appointment &&
        appointmentInfo.appointment.number &&
        appointmentInfo.appointment.type &&
        appointmentInfo.callerId &&
        appointmentInfo.callerId
      ) {
        setLatestAppointment(appointmentInfo); // Update latest appointment
        setPreviousAppointments(prevAppointments => {
          // Update previous appointments, keeping only the latest 5
          const updatedAppointments = [appointmentInfo, ...prevAppointments.slice(0, 4)];
          return updatedAppointments;
        });
        setIsPulsing(true); // Trigger the pulse effect
        setTimeout(() => setIsPulsing(false), 5000);
      }
    });
  
    return () => {
      socket.disconnect(); // Clean up WebSocket connection
    };
  }, []);
  
  

  return (
<div className="grid grid-cols-4 grid-rows-4 gap-0 flex-grow">
  {/* Display latest appointment in 2/3 of the screen */}
  <div className={`col-span-3 row-span-3 p-8 border rounded-lg flex justify-center items-center ${isPulsing ? 'animate-pulse' : ''}`}>
    {latestAppointment && (
      <div className='text-center capitalize'>
        <p className=" text-[10vh] mb-2">{latestAppointment.appointment.type}</p>
        <h2 className="text-[14vh] font-bold mb-4">{latestAppointment.appointment.number}</h2>
        <p className="text-[10vh] text-gray-600">Position: {latestAppointment.position}</p>
      </div>
    )}
  </div>

  {/* Display previous appointments in 1/3 of the screen */}
  <div className="col-span-1 row-span-3 p-8 border rounded-lg">
    <h3 className="text-xl font-bold mb-4">Previous Appointments</h3>
    <ul>
      {previousAppointments.map(appointmentInfo => (
        <li key={appointmentInfo.appointment.id} className="mb-4">
          {/* <p className="text-lg text-gray-600">{appointmentInfo.appointment.type}</p> */}
          <p className="text-lg font-bold">{appointmentInfo.appointment.number}</p>
          <p className="text-lg text-gray-600">Position: {appointmentInfo.position}</p>
        </li>
      ))}
    </ul>
  </div>

  <div className="col-span-3 row-span-1 p-8 border rounded-lg">
  <Image
      src="/logo.png"
      width={100}
      height={100}
      alt="Picture of the author"
    />
  </div>

  <div className="col-span-1 row-span-1 p-8 border rounded-lg">
  <Clock />
  </div>
</div>


  );
}

export default Page;
