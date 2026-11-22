import { useEffect, useState } from 'react';

function secondsUntilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end - now) / 1000));
}

const pad = (n) => String(n).padStart(2, '0');

// นับถอยหลังถึงเที่ยงคืนของวันนี้ (เวลาในเครื่องผู้ใช้)
export default function Countdown() {
  const [seconds, setSeconds] = useState(secondsUntilMidnight);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(secondsUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = [
    { value: Math.floor(seconds / 3600), unit: 'ชม.' },
    { value: Math.floor((seconds % 3600) / 60), unit: 'นาที' },
    { value: seconds % 60, unit: 'วิ' },
  ];

  return (
    <div className="flex items-center gap-2" role="timer" aria-label="เวลาที่เหลือของโปรโมชั่น">
      {parts.map((part) => (
        <div
          key={part.unit}
          className="flex min-w-14 flex-col items-center rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm"
        >
          <span className="text-xl font-semibold tabular-nums">{pad(part.value)}</span>
          <span className="text-[10px] opacity-80">{part.unit}</span>
        </div>
      ))}
    </div>
  );
}
