"use client";

import React, { useMemo, useState } from "react";
import type { Publication } from "../../../../lib/types";
import PublicationCard from "./PublicationCard";
import PublicationViewer from "./PublicationViewer";

interface PublicationsGridProps {
  publications: Publication[];
  categories: string[];
  error?: string;
}

export default function PublicationsGrid({
  publications,
  categories,
  error,
}: PublicationsGridProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activePublication, setActivePublication] = useState<Publication | null>(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return publications.filter((publication) => {
      if (
        activeCategory &&
        publication.category.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }

      if (!needle) return true;

      const haystack = `${publication.title} ${publication.filename} ${publication.category}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [publications, search, activeCategory]);

  const openViewer = (publication: Publication) => {
    setActivePublication(publication);
    setViewerOpen(true);
  };

  const categoryPills = ["All", ...categories];

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-amber-800">
        <h2 className="text-lg font-semibold">Publications unavailable</h2>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-6">
          <label className="sr-only" htmlFor="publications-search">
            Search documents
          </label>
          <input
            id="publications-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search publications by title or filename"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/30"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {categoryPills.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat === "All" ? undefined : cat)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                (cat === "All" && !activeCategory) ||
                (cat !== "All" && activeCategory?.toLowerCase() === cat.toLowerCase())
                  ? "bg-primary-green text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
              aria-pressed={
                (cat === "All" && !activeCategory) ||
                (cat !== "All" && activeCategory?.toLowerCase() === cat.toLowerCase())
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
            <h2 className="text-lg font-semibold text-gray-700">
              No publications found
            </h2>
            <p className="mt-2 text-sm">
              Try adjusting your filters or check back later for new documents.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((publication) => (
              <PublicationCard
                key={publication.key}
                publication={publication}
                onView={openViewer}
                active={
                  activePublication?.key === publication.key && viewerOpen
                }
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500 text-center">
          Showing {filtered.length} of {publications.length} document
          {publications.length === 1 ? "" : "s"}.
        </p>
      </div>

      <PublicationViewer
        open={viewerOpen}
        publication={activePublication}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}