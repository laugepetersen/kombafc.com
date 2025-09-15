import { globals } from "@/db";
import cn from "@/utilities/cn";

/**
 * Countdown banner
 */
export default function CountdownBanner() {
  const daysLeft = Math.floor(
    // @ts-ignore
    (globals.nextEventDate - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={cn(
        "text-sm relative z-60 h-(--banner-height) flex justify-center items-center py-1 font-bold italic bg-[linear-gradient(90deg,#4C0C83_20%,#9C2BFF_50%,#4C0C83_80%)] text-white",
        {
          hidden: daysLeft < 1,
        }
      )}
    >
      {daysLeft} DAYS LEFT
    </div>
  );
}
