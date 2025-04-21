"use client";
import React, { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";

interface DatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  className = "",
  placeholder = "Select date...",
  minDate,
  maxDate,
}) => {
  const [date, setDate] = useState<Date>(selected || new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(date));
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    setDate(selected || new Date());
  }, [selected]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle date selection
  const handleDateClick = (day: Date) => {
    setDate(day);
    onChange(day);
    setOpen(false);
  };

  // Check if date is in valid range
  const isDateInRange = (day: Date) => {
    if (minDate && day < minDate) return false;
    if (maxDate && day > maxDate) return false;
    return true;
  };

  // Generate calendar days
  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    // Calendar header - days of week
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const dayHeader = dayNames.map((d, index) => (
      <div key={index} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
        {d}
      </div>
    ));

    rows.push(
      <div key="header" className="grid grid-cols-7 mb-1">
        {dayHeader}
      </div>
    );

    // Calendar body
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, date);
        const isCurrentDate = isToday(day);
        const isDisabled = !isDateInRange(day);

        days.push(
          <div
            key={day.toString()}
            className={`w-8 h-8 flex items-center justify-center text-sm cursor-pointer rounded-full mx-auto ${
              isCurrentMonth ? "" : "text-gray-300"
            } ${isSelected ? "bg-[#004a7c] text-white" : ""}
            ${isCurrentDate && !isSelected ? "border border-[#00a9e0]" : ""}
            ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-[#e6f7fd]"}`}
            onClick={() => !isDisabled && handleDateClick(cloneDay)}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 mb-1">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`${className} cursor-pointer flex items-center`}
        onClick={() => setOpen(!open)}
      >
        <input
          type="text"
          readOnly
          value={selected ? format(selected, "MMMM d, yyyy") : ""}
          placeholder={placeholder}
          // className="w-full h-12 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 pr-10 cursor-pointer"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-64 rounded-lg bg-white shadow-lg border border-gray-200 p-3">
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="font-medium text-[#004a7c]">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div>{renderDays()}</div>
          <div className="mt-3 flex justify-between">
            <button
              type="button"
              onClick={() => {
                handleDateClick(new Date());
              }}
              className="text-sm text-[#00a9e0] hover:text-[#004a7c] font-medium"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
