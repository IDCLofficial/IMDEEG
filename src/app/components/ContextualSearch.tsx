// "use client"

// import { useState } from "react";
// import SearchBar from "./SearchBar";
// import SearchResults from "./SearchResults";
// // import { useSearch, SearchContext } from "../hooks/useSearch";

// interface ContextualSearchProps {
//   context: SearchContext;
//   placeholder?: string;
//   className?: string;
//   showResults?: boolean;
//   resultsClassName?: string;
// }

// export default function ContextualSearch({
//   context,
//   placeholder,
//   className = "",
//   showResults = true,
//   resultsClassName = ""
// }: ContextualSearchProps) {
//   const [showResultsPanel, setShowResultsPanel] = useState(false);
  
//   const {
//     query,
//     results,
//     isLoading,
//     error,
//     handleSearch,
//     clearSearch
//   } = useSearch({ context });

//   const handleSearchSubmit = (searchQuery: string) => {
//     handleSearch(searchQuery);
//     setShowResultsPanel(true);
//   };

//   const handleClearSearch = () => {
//     clearSearch();
//     setShowResultsPanel(false);
//   };

//   const getContextPlaceholder = () => {
//     switch (context) {
//       case 'news':
//         return placeholder || "Search news articles...";
//       case 'media':
//         return placeholder || "Search media gallery...";
//       case 'events':
//         return placeholder || "Search events...";
//       case 'projects':
//         return placeholder || "Search projects...";
//       default:
//         return placeholder || "Search...";
//     }
//   };

//   return (
//     <div className={`relative ${className}`}>
//       <SearchBar
//         placeholder={getContextPlaceholder()}
//         onSearch={handleSearchSubmit}
//         initialValue={query}
//         className="mb-4"
//       />
      
//       {showResults && showResultsPanel && (
//         <SearchResults
//           results={results}
//           isLoading={isLoading}
//           error={error}
//           query={query}
//           onClearSearch={handleClearSearch}
//           className={`${resultsClassName} absolute max-w-full`}
//         />
//       )}
//     </div>
//   );
// } 