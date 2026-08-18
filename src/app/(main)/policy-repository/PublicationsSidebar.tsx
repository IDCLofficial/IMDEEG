"use client";

import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

interface PublicationsSidebarProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange: (category?: string) => void;
  totalCount: number;
  filteredCount: number;
}

export default function PublicationsSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  totalCount,
  filteredCount,
}: PublicationsSidebarProps) {
  const [open, setOpen] = useState(false);

  const renderCategoryList = (mobile = false) => (
    <div
      className={`flex-col gap-1 ${
        mobile ? (open ? "flex" : "hidden") : "hidden md:flex"
      }`}
    >
      <button
        type="button"
        onClick={() => onCategoryChange(undefined)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition ${
          !activeCategory
            ? "bg-primary-green text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
        aria-pressed={!activeCategory}
      >
        <span>All documents</span>
        <span className="text-xs opacity-80">{totalCount}</span>
      </button>
      {categories.map((category) => {
        const isActive =
          activeCategory?.toLowerCase() === category.toLowerCase();
        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
              isActive
                ? "bg-primary-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            aria-pressed={isActive}
          >
            <span className="line-clamp-1">{category}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-full md:w-64 md:flex-shrink-0">
      <div className="rounded-xl border border-gray-200 bg-[#F9F9F9] p-3 md:p-4">
        <div className="mb-2 flex items-center justify-between md:hidden">
          <span className="text-base font-medium">
            {activeCategory ?? "All documents"}
          </span>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="text-gray-500"
            aria-label="Toggle categories"
          >
            <BiChevronDown
              className={`text-xl transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="hidden md:block">
          <h3 className="mb-3 text-base font-medium">Categories</h3>
        </div>

        {renderCategoryList(false)}

        <div className="md:hidden">{renderCategoryList(true)}</div>

        <p className="mt-4 text-xs text-gray-500">
          Showing {filteredCount} of {totalCount} document
          {totalCount === 1 ? "" : "s"}.
        </p>
      </div>
    </aside>
  );
}
