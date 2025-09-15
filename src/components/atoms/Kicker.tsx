import cn from "@/utilities/cn";

interface KickerProps {
  text: string;
  className?: string;
}

export default function Kicker(props: KickerProps) {
  const { text, className } = props;

  return (
    <div
      className={cn(
        "font-bold italic text-accent-yellow tracking-[-0.02em] ",
        className
      )}
    >
      {text}
    </div>
  );
}
