"use client";

import * as React from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs />");
  }

  return context;
}

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? ""
  );

  const currentValue = value ?? internalValue;

  const setValue = React.useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternalValue(next);
      }

      onValueChange?.(next);
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        setValue,
      }}
    >
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({
  className = "",
  children,
  ...props
}: TabsListProps) {
  return (
    <div
      className={`
        inline-flex rounded-2xl border border-black/10
        bg-black/3 p-1
        dark:border-white/10 dark:bg-white/3
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className = "",
  children,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, setValue } = useTabsContext();

  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={`
        relative rounded-xl px-4 py-2 text-sm font-medium
        transition-colors duration-200
        focus:outline-none
        text-black/50 hover:text-black
        dark:text-white/50 dark:hover:text-white
        ${isActive ? "text-black dark:text-white" : ""}
        ${className}
      `}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="tabs-active-pill"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          className="
            absolute inset-0 rounded-xl
            border border-black/10
            bg-white shadow-sm
            dark:border-white/10
            dark:bg-white/10
          "
        />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface TabsContentProps
  extends HTMLMotionProps<"div">  {
  value: string;
}

export function TabsContent({
  value,
  className = "",
  children,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();

  const isActive = activeValue === value;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className={`
            mt-4
            ${className}
          `}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}