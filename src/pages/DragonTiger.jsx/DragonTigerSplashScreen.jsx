import { useEffect, useState } from 'react';
import { assets } from './assets';
import ProgressBarIndicator from '../../reusable_component/ProgressBarIndicator';

const duration = 5;

function DragonTigerSplashScreen() {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 1) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div
      className="bg-cover flex items-center justify-center text-white w-full text-xs font-bold bg-center h-[100vh] relative"
      style={{
        backgroundImage: `url(${assets.splashBg})`,
      }}
    >
      <div className='flex flex-col text-bg3 items-center justify-center text-2xl italic'>
        <p>Loading...</p>
        <p>Time To Go: {timeLeft} second{timeLeft > 1 ? 's' : ''}</p>
        <ProgressBarIndicator />
      </div>
    </div>
  );
}

export default DragonTigerSplashScreen;
