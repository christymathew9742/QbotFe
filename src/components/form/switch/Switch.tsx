"use client";
import React, { useState } from "react";

interface SwitchProps {
  label: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray"; // Added prop to toggle color theme
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
    color === "blue"
      ? {
          background: checked
          ? "bg-custom-them-clr dark:custom-them-clr"
          : "bg-gray-200 dark:bg-gray-400",
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
      className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
        disabled ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
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
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
        ></div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
