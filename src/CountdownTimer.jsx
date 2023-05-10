import React, { useState, useEffect } from 'react';
import { differenceInSeconds, addDays, startOfDay } from 'date-fns';

function CountdownTimer() {
  const [countdown, setCountdown] = useState('');
  console.log('countdown')

  useEffect(() => {
    let now = new Date();
    let startOfToday = startOfDay(now);
    let startOfTomorrow = addDays(startOfToday, 1);
    let diffInSeconds = differenceInSeconds(startOfTomorrow, now);

    let intervalId = setInterval(() => {
      diffInSeconds--;

      if (diffInSeconds === 0) {
        startOfTomorrow = addDays(startOfTomorrow, 1);
        diffInSeconds = differenceInSeconds(startOfTomorrow, now);
      }

      let remainingSeconds = diffInSeconds % 60;
      let remainingMinutes = Math.floor(diffInSeconds / 60) % 60;
      let remainingHours = Math.floor(diffInSeconds / 3600);

      let countdownTimer = `${remainingHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

      setCountdown(countdownTimer);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <div className="countdown"><strong>{countdown}</strong> until the next game</div>;
}

export default CountdownTimer;
