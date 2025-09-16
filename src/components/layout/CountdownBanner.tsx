"use client";

import { globals } from "@/db";
import cn from "@/utilities/cn";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

/**
 * Countdown banner
 */
export default function CountdownBanner() {
  const targetDate = DateTime.fromJSDate(globals.nextEventDate);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    const now = DateTime.now();
    const diff = targetDate.diff(now, ["days", "hours"]).toObject();

    setTimeLeft({
      days: Math.max(0, Math.floor(diff.days || 0)),
      hours: Math.max(0, Math.floor(diff.hours || 0)),
    });
    const timer = setInterval(() => {
      const now = DateTime.now();
      const diff = targetDate.diff(now, ["days", "hours"]).toObject();

      setTimeLeft({
        days: Math.max(0, Math.floor(diff.days || 0)),
        hours: Math.max(0, Math.floor(diff.hours || 0)),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "text-sm relative z-60 h-(--banner-height) flex justify-center items-center py-1 font-bold italic bg-[linear-gradient(90deg,#4C0C83_20%,#9C2BFF_50%,#4C0C83_80%)] text-white"
      )}
    >
      {timeLeft.days > 0 ? (
        <>
          {timeLeft.days} {timeLeft.days === 1 ? "DAY" : "DAYS"} LEFT{" "}
        </>
      ) : (
        <>
          {timeLeft.hours} {timeLeft.hours === 1 ? "HOUR" : "HOURS"} LEFT
        </>
      )}
    </div>
  );
}
