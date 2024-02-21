"use client"

import React, { useState, useEffect } from 'react';
import createSocket from '@/lib/websocket'; // Import your WebSocket utility

function Page() {
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  useEffect(() => {
    const socket = createSocket(); // Create WebSocket connection
    socket.on('calledAppointment', (appointmentInfo) => {
      console.log(appointmentInfo);
  
      // Check if appointmentInfo has all the required fields
      if (
        appointmentInfo &&
        appointmentInfo.appointment &&
        appointmentInfo.appointment.number &&
        appointmentInfo.appointment.type &&
        appointmentInfo.callerId &&
        appointmentInfo.callerId.callerId
      ) {
        setLatestAppointment(appointmentInfo); // Update latest appointment
        setPreviousAppointments(prevAppointments => {
          // Update previous appointments, keeping only the latest 5
          const updatedAppointments = [appointmentInfo, ...prevAppointments.slice(0, 4)];
          return updatedAppointments;
        });
      }
    });
  
    return () => {
      socket.disconnect(); // Clean up WebSocket connection
    };
  }, []);
  
  

  return (
    <div className="flex">
    {/* Display latest appointment in 2/3 of the screen */}
    <div className="w-2/3 p-8 border border-gray-200 rounded-lg mr-4">
      {latestAppointment && (
        <div>
          <h2 className="text-3xl font-bold mb-4">{latestAppointment.appointment.number}</h2>
          <p className="text-lg mb-2">{latestAppointment.appointment.type}</p>
          <p className="text-lg text-gray-600">Position: {latestAppointment.callerId.callerId}</p>
        </div>
      )}
    </div>
  
    {/* Display previous appointments in 1/3 of the screen */}
    <div className="w-1/3 p-8 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Previous Appointments</h3>
      <ul>
        {previousAppointments.map(appointmentInfo => (
          <li key={appointmentInfo.appointment.id} className="mb-4">
            <p className="text-lg font-bold">{appointmentInfo.appointment.number}</p>
            <p className="text-lg text-gray-600">{appointmentInfo.appointment.type}</p>
            <p className="text-lg text-gray-600">Position: {appointmentInfo.callerId.callerId}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
  
  );
}

export default Page;
