"use client"

import { useEffect, useState } from "react";

export function Countdown({ eventDateTime }: { eventDateTime: string }) {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    function calculateTimeLeft() {
      const target = new Date(eventDateTime).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setEnded(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [eventDateTime]);

  if (ended) {
    return (
      <div className="bg-gray-400 text-white rounded-lg px-8 py-4 flex items-center text-center w-max mt-4 mb-6 md:mb-0 md:absolute md:bottom-6 md:right-10 shadow-lg">
        <span className="text-lg font-semibold">Event has ended.</span>
      </div>
    );
  }
  if (!timeLeft) return null;
  return (
    <div className="bg-green-700 text-white rounded-lg px-8 py-4 flex gap-6 items-center text-center w-max mt-4 mb-6 md:mb-0 md:absolute md:bottom-6 md:right-10 shadow-lg">
      <div>
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-xs uppercase">Days</div>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div>
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs uppercase">Hours</div>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div>
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs uppercase">Minutes</div>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div>
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs uppercase">Seconds</div>
      </div>
    </div>
  );
}