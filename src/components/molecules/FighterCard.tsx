import cn from "@/utilities/cn";
import Image from "next/image";

/**
 * Props for {@link FighterCard}
 */
interface FighterCardProps {
  className?: string;
  imageSrc: string;
  firstName: string;
  lastName: string;
  title: string;
  weight: string;
}

/**
 * Fighter card
 */
export default function FighterCard(props: FighterCardProps) {
  return (
    <div
      className={cn(
        props.className,
        "relative flex items-end p-5 aspect-[3/4] w-full"
      )}
    >
      <h3
        className={
          "text-white font-black italic leading-[100%] tracking-[-0.04rem] mr-8"
        }
      >
        <p>
          {props.firstName}
          <br />
          <span className={"text-2xl uppercase"}>{props.lastName}</span>
        </p>
      </h3>
      <div
        className={
          "absolute top-1 rotate-90 origin-bottom-left left-5 font-bold text-accent-yellow [text-shadow:0_0_8px_rgba(247,242,37,0.8)] uppercase"
        }
      >
        {props.title}
      </div>
      <div
        className={
          "absolute bottom-7 left-[calc(100%-20px)] origin-bottom-left -rotate-90 font-bold whitespace-nowrap text-accent-yellow [text-shadow:0_0_8px_rgba(247,242,37,0.8)] uppercase"
        }
      >
        {props.weight}
      </div>
      <div
        className={cn(
          "absolute -z-10 top-0 left-0 w-full h-full",
          "[clip-path:polygon(8%_0,100%_0,100%_15%,calc(100%-4%)_calc(15%+3%),calc(100%-4%)_40%,100%_calc(40%+3%),100%_calc(100%-6%),calc(100%-8%)_100%,0_100%,0_6%)]"
        )}
      >
        <Image
          className={
            "absolute -z-10 top-0 left-0 w-full h-full object-cover object-top"
          }
          src={props.imageSrc}
          alt={"Fighter image"}
          width={400}
          height={800}
        />
        <div
          className={
            "absolute -z-10 bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.9)_100%)]"
          }
        ></div>
      </div>
    </div>
  );
}
