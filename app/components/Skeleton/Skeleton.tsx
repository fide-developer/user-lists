import type { ComponentProps } from "react";

export default function Skeleton({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-black/10 dark:bg-white/10 ${className}`.trim()}
      {...props}
    />
  );
}
