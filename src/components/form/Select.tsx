import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); 
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-md border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-color-primary-light placeholder:text-color-primary-light focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue
          ? "text-color-primary dark:text-white/90"
          : "text-color-primary-light dark:text-color-primary-light"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
    >
      <option
        value="empty"
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-color-primary-light"
      >
        {placeholder}
      </option>

      {options?.map((option) => (
        <option
          key={option?.value}
          value={option?.value}
          disabled={option?.disabled}
          className={`
            dark:bg-gray-900 
            ${option?.disabled 
                ? "bg-gray-200 text-color-primary-light dark:bg-color-primary dark:text-gray-600 cursor-not-allowed" // Disabled styles
                : "text-gray-700 dark:text-color-primary-light"
            }
          `}
        >
          {option?.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
