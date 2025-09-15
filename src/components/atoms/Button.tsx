"use client";

import cn from "@/utilities/cn";
import Link, { LinkProps } from "next/link";

interface ButtonProps extends LinkProps {
  type: "yellow" | "black" | "white" | "outline-white" | "outline-black";
  className?: string;
  children: string;
  target?: string;
}

export default function Button(props: ButtonProps) {
  const { className, children, ...linkProps } = props;

  // const hasScrambled = useRef(false);

  // const { ref, replay } = useScramble({
  //   text: children,
  //   speed: 0.5,
  //   tick: 2,
  //   scramble: 2,
  //   step: 4,
  //   chance: 0.8,
  //   overdrive: false,
  //   overflow: true,
  //   playOnMount: false,
  //   range: [65, 125],
  // });

  // const handleMouseEnter = () => {
  //   if (!hasScrambled.current) {
  //     hasScrambled.current = true;
  //   }
  //   replay();
  // };

  return (
    <Link
      className={cn(
        "inline-flex justify-center items-center h-12 px-5 text-sm font-bold font-heading uppercase",
        props.type === "yellow" &&
          "bg-gradient-to-br from-accent-yellow to-[#F9F666] text-black hover:to-accent-yellow",
        props.type === "black" && "text-white bg-black",
        props.type === "white" && "text-black bg-white",
        props.type === "outline-white" &&
          "[border-image:linear-gradient(45deg,rgba(255,255,255,0.6),rgba(255,255,255,0.3))_1] border text-white hover:[border-image:linear-gradient(45deg,rgba(255,255,255,0.6),rgba(255,255,255,1))_1] transition-all",
        props.type === "outline-black" &&
          "[border-image:linear-gradient(45deg,rgba(0,0,0,0.6),rgba(0,0,0,0.3))_1] border text-black hover:[border-image:linear-gradient(45deg,rgba(0,0,0,0.6),rgba(0,0,0,1))_1]",
        className
      )}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
