import React, { useState, useEffect, useContext } from 'react';
import { differenceInSeconds, addDays, startOfDay } from 'date-fns';
import MidnightContext from './contexts/MidnightContext'
import styles from "./CountdownTimer.module.css";

function CountdownTimer() {
  const [countdown, setCountdown] = useState('');
  const {setIsMidnight} = useContext(MidnightContext);
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
      if (countdown === "00:00:00") {
        setIsMidnight(true);
      } else {
        setIsMidnight(false);
      }
      setCountdown(countdownTimer);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <div className={styles.countdown}><span className={styles.countdownClock}>{countdown}</span> <br />until the next puzzle</div>;
}

export default CountdownTimer;
