"use client"

import Image from "next/image";
import Link from "next/link";
import { LuSearch, LuX, LuLoader } from "react-icons/lu";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  type?: string;
  url?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  onClearSearch: () => void;
  className?: string;
}

export default function SearchResults({
  results,
  isLoading,
  error,
  query,
  onClearSearch,
  className = ""
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <LuLoader className="animate-spin text-green-600 text-2xl mr-2" />
          <span className="text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8 text-red-600">
          <LuX className="text-xl mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results for &quot;{query}&quot;
          </h3>
          <button
            onClick={onClearSearch}
            className="text-gray-500 hover:text-gray-700"
          >
            <LuX className="text-xl" />
          </button>
        </div>
        <div className="text-center py-8">
          <LuSearch className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">No results found for &quot;{query}&quot;</p>
          <p className="text-gray-500 text-sm mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </h3>
        <button
          onClick={onClearSearch}
          className="text-gray-500 hover:text-gray-700"
        >
          <LuX className="text-xl" />
        </button>
      </div>
      
      <div className="divide-y divide-gray-200">
        {results.map((result) => (
          <Link
            key={result.id}
            href={result.url || '#'}
            className="block p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-4">
              {result.image && (
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {result.title}
                  </h4>
                  {result.type && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {result.type}
                    </span>
                  )}
                </div>
                
                {result.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {result.description}
                  </p>
                )}
                
                {result.date && (
                  <p className="text-gray-500 text-xs">
                    {result.date}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 