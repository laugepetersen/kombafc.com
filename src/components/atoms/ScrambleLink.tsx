"use client";

import Link from "next/link";
import { CSSProperties, useRef } from "react";
import { useScramble } from "use-scramble";

interface ScrambleLinkProps {
  href: string;
  children: string;
  className?: string;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ScrambleLink({
  href,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: ScrambleLinkProps) {
  const hasScrambled = useRef(false);

  const { ref, replay } = useScramble({
    text: children,
    speed: 0.5,
    tick: 2,
    scramble: 2,
    step: 4,
    chance: 0.8,
    overdrive: false,
    overflow: true,
    playOnMount: false,
    range: [65, 125],
  });

  const handleMouseEnter = () => {
    if (!hasScrambled.current) {
      hasScrambled.current = true;
    }
    replay();
    onMouseEnter?.();
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      style={{
        ...style,
        display: "inline-block",
        width: children.length + "ch",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}
