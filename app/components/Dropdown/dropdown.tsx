import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

import {
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";

import Button from "../Button";

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  selectedValue: string;

  onChange: (value: string) => void;
};

const DropdownContext =
  createContext<DropdownContextType | null>(
    null
  );

function useDropdownContext(): DropdownContextType {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error(
      "Dropdown components must be used inside <Dropdown>"
    );
  }

  return context;
}

type OptionGroupContextType = {
  selectedValue: string;

  onSelect: (value: string) => void;
};

const OptionGroupContext =
  createContext<OptionGroupContextType | null>(
    null
  );

function useOptionGroupContext() {
  return useContext(OptionGroupContext);
}

type DropdownProps = {
  children: ReactNode;

  value: string;

  onChange: (value: string) => void;
};

function Dropdown({
  children,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] =
    useState<boolean>(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <DropdownContext
      value={{
        open,
        setOpen,
        selectedValue: value,
        onChange,
      }}
    >
      <div
        ref={dropdownRef}
        className="relative inline-block text-left"
      >
        {children}
      </div>
    </DropdownContext>
  );
}

type TriggerProps = {
  children: ReactNode;
};

function Trigger({
  children,
}: TriggerProps) {
  const { open, setOpen } =
    useDropdownContext();

  return (
    <Button
      type="button"
      onClick={() =>
        setOpen((prev) => !prev)
      }
      className="h-full text-nowrap"
      size="md"
      intent="secondary"
    >
      {children}

      <FiChevronDown
        className={`transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </Button>
  );
}

type OptionContainerProps = {
  children: ReactNode;
};

function OptionContainer({
  children,
}: OptionContainerProps) {
  const { open } =
    useDropdownContext();

  if (!open) {
    return null;
  }

  return (
    <div className="absolute right-0 z-50 mt-2 w-fit overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

type OptionProps = {
  children: ReactNode;

  value: string;
};

function Option({
  children,
  value,
}: OptionProps) {
  const dropdown =
    useDropdownContext();

  const optionGroup =
    useOptionGroupContext();

  const isInsideGroup =
    optionGroup !== null;

  const isSelected = isInsideGroup
    ? optionGroup.selectedValue === value
    : dropdown.selectedValue === value;

  function handleSelect() {
    if (isInsideGroup) {
      optionGroup.onSelect(value);
    } else {
      dropdown.onChange(value);
    }

    dropdown.setOpen(false);
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`flex w-full items-center justify-between px-4 py-2 text-sm text-nowrap transition ${
        isSelected
          ? "bg-gray-100 font-medium text-gray-900"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span>{children}</span>

      {isSelected && (
        <FiCheck className="text-gray-900" />
      )}
    </button>
  );
}

type OptionGroupProps = {
  title: string;

  value: string;

  onChange: (value: string) => void;

  children: ReactNode;
};

function OptionGroup({
  title,
  value,
  onChange,
  children,
}: OptionGroupProps) {
  return (
    <OptionGroupContext
      value={{
        selectedValue: value,
        onSelect: onChange,
      }}
    >
      <div className="py-1">
        <div className="px-4 py-2 text-sm font-semibold text-gray-900">
          {title}
        </div>

        {children}
      </div>
    </OptionGroupContext>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.OptionContainer =
  OptionContainer;
Dropdown.Option = Option;
Dropdown.OptionGroup = OptionGroup;

export default Dropdown;