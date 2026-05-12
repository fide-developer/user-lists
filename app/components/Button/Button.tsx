import type { ComponentProps } from "react";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonIntent = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ComponentProps<"button"> & {
  size?: ButtonSize;
  intent?: ButtonIntent;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const intentClasses: Record<ButtonIntent, string> = {
  primary:
    "bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85",
  secondary:
    "border border-black/15 text-black hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost:
    "text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

export function buttonClasses({
  size = "md",
  intent = "primary",
  className = "",
}: {
  size?: ButtonSize;
  intent?: ButtonIntent;
  className?: string;
} = {}): string {
  return `${baseClasses} ${sizeClasses[size]} ${intentClasses[intent]} ${className}`.trim();
}

export default function Button({
  size = "md",
  intent = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ size, intent, className })}
      {...props}
    />
  );
}
