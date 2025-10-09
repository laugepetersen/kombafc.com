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
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const now = DateTime.now();
    const diff = targetDate.diff(now, ["days", "hours", "minutes"]).toObject();

    if (targetDate.diff(now).as("hours") < -7) {
      setHasEnded(true);
    }

    setTimeLeft({
      days: Math.floor(diff.days || 0),
      hours: Math.floor(diff.hours || 0),
      minutes: Math.floor(diff.minutes || 0),
    });

    setTimeLeft({
      days: Math.max(0, Math.floor(diff.days || 0)),
      hours: Math.max(0, Math.floor(diff.hours || 0)),
      minutes: Math.max(0, Math.floor(diff.minutes || 0)),
    });
    const timer = setInterval(() => {
      const now = DateTime.now();
      const diff = targetDate.diff(now, ["days", "hours"]).toObject();

      setTimeLeft({
        days: Math.max(0, Math.floor(diff.days || 0)),
        hours: Math.max(0, Math.floor(diff.hours || 0)),
        minutes: Math.max(0, Math.floor(diff.minutes || 0)),
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return hasEnded ? null : (
    <div
      className={cn(
        "text-sm relative z-60 h-(--banner-height) flex justify-center items-center py-1 font-bold italic bg-[linear-gradient(90deg,#4C0C83_20%,#9C2BFF_50%,#4C0C83_80%)] text-white"
      )}
    >
      {timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 ? (
        <>BROADCASTING LIVE NOW</>
      ) : (
        <>
          BEGINS IN {timeLeft.days > 0 && <>{timeLeft.days} DAY</>}{" "}
          {timeLeft.hours > 0 && <>{timeLeft.hours} HOURS</>}{" "}
          {timeLeft.minutes > 0 && <>{timeLeft.minutes} MIN</>}
        </>
      )}
    </div>
  );
}
