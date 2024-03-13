"use client"

import React, { useState, useEffect } from 'react';
import createSocket from '@/lib/websocket'; // Import your WebSocket utility
import Image from 'next/image'
import dynamic from 'next/dynamic';
import {Howl} from 'howler';

const Clock = dynamic(() => import('./clock'), { ssr: false });

function Page() {
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [isPulsing, setIsPulsing] = useState(false);
  const [nextAppointments, setNextAppointments] = useState([]);

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
        var sound = new Howl({
          src: ['sound.mp3'],
          html5: true
        });
        
        sound.play();
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
  

    socket.on("updatedQueue", (data) => {
      // console.log(data);
      if (data[0]?.content === "No more people in queue") {
        // console.log("empty");
        //here you could add logic to empty queue with socket
        setNextAppointments([])

      } else {
        setNextAppointments(data)
      }
    });

    return () => {
      socket.disconnect(); // Clean up WebSocket connection
    };
  }, []);
  
  // console.log(nextAppointments)

  return (
<div className="grid grid-cols-4 grid-rows-4 gap-0 flex-grow">
  {/* Display latest appointment in 2/3 of the screen */}
  <div className={`col-span-3 row-span-3 p-8 border rounded-lg flex justify-center items-center ${isPulsing ? 'animate-pulse' : ''}`}>
    {latestAppointment && (
      <div className='text-center capitalize'>
        <p className=" text-[10vh] mb-2">{latestAppointment.appointment.type}</p>
        <h2 className="text-[14vh] font-bold mb-4">{latestAppointment.appointment.number}</h2>
        <p className="text-[10vh] text-gray-600">Position {latestAppointment.position}</p>
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

  {nextAppointments.length > 0 ? (

  <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
    {nextAppointments.map((appointment, index) => (
        <li key={index}>
          {appointment.number}
        </li>
      ))}
    </ul>
    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true"> 
    {nextAppointments.map((appointment, index) => (
        <li key={index}>
          {appointment.number}
        </li>
      ))}
    </ul>
</div>
 ) : (
  <p>No more people in queue</p>
)}

  </div>

  <div className="col-span-1 row-span-1 p-8 border rounded-lg">
  <Clock />
  </div>
</div>


  );
}

export default Page;
