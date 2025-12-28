"use client";
import React from "react";

interface SwitchProps {
  label: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "theme" | "gray"; // Added prop to toggle color theme
}

const Switch: React.FC<SwitchProps> = ({
  label,
  checked = false,
  disabled = false,
  onChange,
  color = "",
}) => {
  const handleToggle = () => {
    if (disabled) return;
    if (onChange) {
      onChange(!checked);
    }
  };

  const switchColors =
    color === "theme"
      ? {
          background: checked
          ? "bg-color-primary dark:bg-color-primary"
          : "bg-gray-200 dark:bg-color-primary-light",
          knob: checked ? "translate-x-full bg-white" : "translate-x-0 bg-white",
          
        }
      : {
          background: checked
          ? "bg-brand-500"
          : "bg-gray-200 dark:bg-white/10",
          knob: checked ? "translate-x-full bg-white" : "translate-x-0 bg-white",
        };

  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium w-[44px] ${
        disabled ? "text-color-primary-light" : "text-gray-600 dark:text-color-primary-light"
      }`}
      onClick={handleToggle}
    >
      <div className="relative">
        <div
          className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
            disabled
              ? "bg-gray-100 pointer-events-none"
              : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-color-primary-light duration-150 ease-linear transform ${switchColors.knob}`}
        ></div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
