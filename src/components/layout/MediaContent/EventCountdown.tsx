"use client";

import { content } from "@/db";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

/**
 * Event countdown
 */
export default function EventCountdown() {
  const targetZone = "Europe/Copenhagen";
  const targetDate = DateTime.fromJSDate(
    content.homePage.mediaContent.eventDate,
    {
      zone: targetZone,
    }
  );
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = DateTime.now().setZone(targetZone);
    const diff = targetDate
      .diff(now, ["days", "hours", "minutes", "seconds"])
      .toObject();

    return {
      days: Math.max(0, Math.floor(diff.days || 0)),
      hours: Math.max(0, Math.floor(diff.hours || 0)),
      minutes: Math.max(0, Math.floor(diff.minutes || 0)),
      seconds: Math.max(0, Math.floor(diff.seconds || 0)),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={
        "bg-[linear-gradient(90deg,#871FCC_0%,#5D1578_100%)] bg-clip-text text-transparent font-semibold italic"
      }
    >
      <span>{timeLeft.days}D</span>
      <span> : </span>
      <span>{timeLeft.hours}H</span>
      <span> : </span>
      <span suppressHydrationWarning>
        {timeLeft.minutes.toString().padStart(2, "0")}M
      </span>
      <span> : </span>
      <span suppressHydrationWarning>
        {timeLeft.seconds.toString().padStart(2, "0")}S
      </span>
    </div>
  );
}
