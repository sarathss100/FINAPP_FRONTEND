"use client";

import React, { useState, ChangeEvent } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps {
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  children: React.ReactNode;
}

interface OptionProps {
  value: string | number;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ 
  id,
  name,
  value,
  onChange,
  className = "",
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the selected option label
  const getSelectedLabel = () => {
    let selectedOption = null;
    
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<OptionProps>(child) && child.props?.value === value) {
        selectedOption = child.props.children;
      }
    });
    
    return selectedOption || "Select an option";
  };


  const handleOptionClick = (optionValue: string | number) => {
    const event = {
    target: {
      name,
      value: optionValue,
      focus: () => {},
      blur: () => {},
    },
  } as ChangeEvent<HTMLSelectElement>;
  
    onChange(event);;
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Hidden native select for form submission */}
      <select 
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        {...props}
      >
        {children}
      </select>
      
      {/* Custom select trigger */}
      <div
        className={`flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={id}
        aria-controls={`${id}-listbox`}
      >
        <span className="block truncate">{getSelectedLabel()}</span>
        <ChevronDown className={`w-4 h-4 ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
      
      {/* Dropdown options */}
      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          role="listbox"
        >
          <ul className="py-1">
            {React.Children.map(children, (child) => {
              // Safely hanlde only valid React elements 
              if (!React.isValidElement<OptionProps>(child)) {
                return null;
              }
              const isSelected = child.props.value === value;
              
              return (
                <li
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleOptionClick(child.props.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="block truncate">
                    {child.props.children}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

// No changes to the option component
export const Option = ({ value, children }: { value: string, children: React.ReactNode}) => {
  return (
    <option value={value}>{children}</option>
  );
};
