import { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '../../utils/time';

export function ReleaseCountdown({ timestamp }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(timestamp));

  useEffect(() => {
    const timer = setInterval(()=> {
      const remaining = calculateTimeRemaining(timestamp);
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000)

    return () => clearInterval(timer); 
  }, [timestamp]);

  if (!timeLeft) return null;

  return (
    <div className="release-countdown-container">
      <div className="release-countdown">
        <div className="days-countdown"><p>{timeLeft.days}</p><p>DAYS</p></div>
        <div className="days-countdown"><p>{timeLeft.hours}</p><p>HOURS</p></div>
        <div className="days-countdown"><p>{timeLeft.minutes}</p><p>MINUTES</p></div>
        <div className="days-countdown"><p>{timeLeft.seconds}</p><p>SECONDS</p></div>
      </div>
    </div>
  );
}

