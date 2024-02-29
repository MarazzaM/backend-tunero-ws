import { useState, useEffect } from 'react';

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Function to update the current time every second
    const updateClock = () => {
      setCurrentTime(new Date());
    };

    // Update the clock every second
    const intervalId = setInterval(updateClock, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once

  // Format options for displaying the time
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    // timeZone: 'UTC', /
  };

  // Format options for displaying the date
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // timeZone: 'UTC', 
  };

  return (
    <div>
      <p>{currentTime.toLocaleString('es-AR', options)}</p>
      <p>{currentTime.toLocaleString('es-AR', dateOptions)}</p>
    </div>
  );
}
