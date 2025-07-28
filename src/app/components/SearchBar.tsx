"use client"

import { LuSearch } from "react-icons/lu";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showButton?: boolean;
  buttonText?: string;
  initialValue?: string;
  disabled?: boolean;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  className = "",
  showButton = true,
  buttonText = "Search",
  initialValue = "",
  disabled = false
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={`flex justify-center py-8 max-md:py-4 w-full md:w-full ${className}`}>
      <form className="flex w-full" onSubmit={handleSubmit}>
        <div className="flex-1 flex items-center gap-1 bg-white rounded px-4 py-2 text-[12px]">
          <LuSearch 
            className="text-gray-500 text-[18px] cursor-pointer" 
            onClick={handleSearchClick}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            disabled={disabled}
            className="flex-1 px-4 py-2 focus:outline-none text-[12px] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {showButton && (
            <button
              type="submit"
              disabled={disabled || !query.trim()}
              className="bg-green-600 text-white px-8 py-2 rounded text-[14px] cursor-pointer max-md:hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              {buttonText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 