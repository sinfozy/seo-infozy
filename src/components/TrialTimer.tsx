import { useEffect, useState } from "react";

import { Plan } from "@/types/enums";
import { TimerIcon } from "lucide-react";

interface TrialTimerProps {
  planEndsAt?: string | Date;
  planName?: Plan;
}

export const TrialTimer: React.FC<TrialTimerProps> = ({
  planEndsAt,
  planName,
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (!planEndsAt || planName !== Plan.TRIAL) return;

    const endTime = new Date(planEndsAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;
      setRemainingTime(Math.max(diff, 0));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [planEndsAt, planName]);

  // If trial has ended
  if (!planEndsAt || remainingTime <= 0) {
    return (
      <div className="h-10 inline-flex items-center px-3 py-1 rounded-md bg-red-100 text-red-700 font-medium text-sm shadow-sm">
        <TimerIcon className="mr-2 h-5 w-5" /> Your Free Trial has ended
      </div>
    );
  }

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return (
    <div className="h-10 inline-flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-primary/10 to-primary/20 text-primary font-medium text-sm shadow-sm">
      <TimerIcon className="mr-2 h-5 w-5" /> Free Trial ends in: {days}d {hours}
      h {minutes}m {seconds}s
    </div>
  );
};
