"use client"

import { useState, useCallback, useEffect } from 'react';
import { newsData, NewsItem } from '../news/newsData';
import { mediaData, MediaItem } from '../media/mediaData';

export type SearchContext = 'news' | 'media' | 'events' | 'projects' | 'general';

interface UseSearchOptions {
  context: SearchContext;
  debounceMs?: number;
  initialQuery?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  type?: string;
  url?: string;
}

export function useSearch({ context, debounceMs = 300, initialQuery = '' }: UseSearchOptions) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Search function with real data for news and media context
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let searchResults: SearchResult[] = [];

      if (context === 'news') {
        searchResults = searchNewsData(searchQuery);
      } else if (context === 'media') {
        searchResults = searchMediaData(searchQuery);
      } else {
        searchResults = generateMockResults(context, searchQuery);
      }

      setResults(searchResults);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    handleSearch,
    clearSearch,
    performSearch: () => performSearch(query)
  };
}

// Function to search through real news data
function searchNewsData(query: string): SearchResult[] {
  const searchTerm = query.toLowerCase();
  
  return newsData
    .filter(newsItem => 
      newsItem.title.toLowerCase().includes(searchTerm) ||
      newsItem.desc.toLowerCase().includes(searchTerm) ||
      newsItem.badge.toLowerCase().includes(searchTerm)
    )
    .map(newsItem => ({
      id: newsItem.id,
      title: newsItem.title,
      description: newsItem.desc,
      image: newsItem.img,
      date: newsItem.date,
      type: 'news',
      url: `/news/${newsItem.slug || newsItem.id}`
    }));
}

// Function to search through real media data
function searchMediaData(query: string): SearchResult[] {
  const searchTerm = query.toLowerCase();

  return mediaData
    .filter(mediaItem =>
      mediaItem.title.toLowerCase().includes(searchTerm) ||
      mediaItem.desc.toLowerCase().includes(searchTerm) ||
      mediaItem.type.toLowerCase().includes(searchTerm)
    )
    .map(mediaItem => ({
      id: mediaItem.id,
      title: mediaItem.title,
      description: mediaItem.desc,
      image: mediaItem.img,
      date: mediaItem.date,
      type: mediaItem.type,
    }));
}

// Mock data generator for different contexts
function generateMockResults(context: SearchContext, query: string): SearchResult[] {
  const baseResults = [
    {
      id: '1',
      title: `Search result for "${query}" in ${context}`,
      description: `This is a mock result for the search query "${query}" in the ${context} context.`,
      image: '/images/homeImage1.png',
      date: new Date().toLocaleDateString(),
      type: context,
      url: `/${context}/1`
    },
    {
      id: '2',
      title: `Another result for "${query}"`,
      description: `Another mock result showing how search works across different ${context} items.`,
      image: '/images/homeImage2.png',
      date: new Date().toLocaleDateString(),
      type: context,
      url: `/${context}/2`
    },
    {
      id: '3',
      title: `Third result for "${query}"`,
      description: `A third mock result demonstrating the search functionality in ${context}.`,
      image: '/images/heroImage.png',
      date: new Date().toLocaleDateString(),
      type: context,
      url: `/${context}/3`
    }
  ];

  // Filter results based on query (case-insensitive)
  return baseResults.filter(result =>
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.description?.toLowerCase().includes(query.toLowerCase())
  );
} 