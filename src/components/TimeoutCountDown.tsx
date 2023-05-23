import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
function TimeOutCountDown({ targetDate }: { targetDate: number }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();
  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate - Date.now();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <p className={'text-sm text-gray-500 mt-2'}>
        <strong>Timeout:</strong>
      </p>
      <section
        id='count-down'
        className='flex flex-row mx-2 drop-shadow-2xl text-sm text-gray-500 mt-2'>
        {timeLeft && timeLeft.days !== 0 && (
          <div className='flex flex-row'>
            <div className='mr-1'>{timeLeft.days}</div>
            <div>days</div>
          </div>
        )}

        {timeLeft && timeLeft.hours !== 0 && (
          <div className='flex flex-row mx-2'>
            <div></div>
            <div className='mr-1'>{timeLeft.hours}</div>
            <div>hours</div>
          </div>
        )}

        {timeLeft && timeLeft.minutes !== 0 && (
          <div className='flex flex-row'>
            <div className='mr-1'>{timeLeft.minutes}</div>
            <div>min</div>
          </div>
        )}

        {timeLeft?.days === 0 && (
          <div className='flex flex-row mx-2'>
            <div className='mr-1'>{timeLeft.seconds}</div>
            <div>sec</div>
          </div>
        )}
      </section>
      {!timeLeft && <p className={'text-sm text-gray-500 mt-2'}>Fee timeout passed</p>}
    </>
  );
}

export default TimeOutCountDown;
