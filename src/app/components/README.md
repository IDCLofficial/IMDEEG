# Search Components Documentation

This document describes the search functionality implemented for the MDEEG website.

## Components Overview

### 1. SearchBar
A basic search input component with customizable props.

**Props:**
- `placeholder?: string` - Search input placeholder text
- `onSearch?: (query: string) => void` - Callback function when search is submitted
- `className?: string` - Additional CSS classes
- `showButton?: boolean` - Whether to show the search button (default: true)
- `buttonText?: string` - Custom button text (default: "Search")
- `initialValue?: string` - Initial search query value
- `disabled?: boolean` - Whether the search is disabled

**Usage:**
```tsx
<SearchBar 
  placeholder="Search news..."
  onSearch={(query) => console.log('Searching for:', query)}
  showButton={true}
  buttonText="Find"
/>
```

### 2. SearchResults
Displays search results with loading states, error handling, and result cards.

**Props:**
- `results: SearchResult[]` - Array of search results
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message if search fails
- `query: string` - Current search query
- `onClearSearch: () => void` - Function to clear search
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<SearchResults
  results={searchResults}
  isLoading={isLoading}
  error={error}
  query={currentQuery}
  onClearSearch={handleClearSearch}
/>
```

### 3. ContextualSearch
A complete search component that combines SearchBar and SearchResults with context-aware functionality.

**Props:**
- `context: SearchContext` - Search context ('news', 'media', 'events', 'projects', 'general')
- `placeholder?: string` - Custom placeholder text
- `className?: string` - Additional CSS classes
- `showResults?: boolean` - Whether to show results panel (default: true)
- `resultsClassName?: string` - CSS classes for results container

**Usage:**
```tsx
<ContextualSearch
  context="news"
  placeholder="Search news articles..."
  showResults={true}
/>
```

## Search Contexts

The search system supports different contexts:

- **news**: Search through news articles and updates
- **media**: Search photos, videos, and press releases
- **events**: Search upcoming and past events
- **projects**: Search ministry projects and initiatives
- **general**: General search across all content

## Custom Hook: useSearch

The `useSearch` hook provides search functionality with debouncing and context-aware results.

**Parameters:**
- `context: SearchContext` - Search context
- `debounceMs?: number` - Debounce delay in milliseconds (default: 300)
- `initialQuery?: string` - Initial search query

**Returns:**
- `query: string` - Current search query
- `results: SearchResult[]` - Search results
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `handleSearch: (query: string) => void` - Function to update search query
- `clearSearch: () => void` - Function to clear search
- `performSearch: () => void` - Function to manually trigger search

**Usage:**
```tsx
const {
  query,
  results,
  isLoading,
  error,
  handleSearch,
  clearSearch
} = useSearch({ context: 'news' });
```

## Implementation Examples

### News Page Search
```tsx
// In NewsHeroSection.tsx
<ContextualSearch 
  context="news" 
  placeholder="Search news articles..."
  showResults={false}
/>
```

### Media Page Search
```tsx
// In MediaHeroSection.tsx
<ContextualSearch
  context="media"
  placeholder="Search media gallery..."
  showResults={false}
/>
```

### Full Search Page
```tsx
// In search/page.tsx
<ContextualSearch
  context={selectedContext}
  placeholder={`Search ${selectedContext}...`}
  showResults={true}
/>
```

## Search Result Interface

```tsx
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  type?: string;
  url?: string;
}
```

## Features

- **Debounced Search**: Prevents excessive API calls while typing
- **Context-Aware**: Different search behavior for different content types
- **Loading States**: Shows loading spinner during search
- **Error Handling**: Displays error messages if search fails
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Customizable**: Flexible props for different use cases

## Future Enhancements

- Real API integration for search results
- Advanced search filters
- Search history
- Search suggestions/autocomplete
- Search analytics
- Voice search support 