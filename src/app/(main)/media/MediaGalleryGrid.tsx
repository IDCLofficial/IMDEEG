"use client"
import React, { useMemo, useState } from "react";
import MediaGalleryCard from "./MediaGalleryCard";
import { Media } from "../../../../lib/types";
import SearchBar from "../../components/SearchBar";
import ImageViewer from "./ImageViewer";

interface MediaGalleryGridProps {
  items: {
    items: Media[];
    total: number;
  };
}

const MediaGalleryGrid: React.FC<MediaGalleryGridProps> = ({ items}:MediaGalleryGridProps) => {
  const [query, setQuery] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string>("");
  const [viewerAlt, setViewerAlt] = useState<string>("");

  const openViewer = (src: string, alt: string) => {
    setViewerSrc(src);
    setViewerAlt(alt);
    setViewerOpen(true);
  };
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.items;
    return items.items.filter((item) => {
      const title = item?.fields?.title ?? "";
      return String(title).toLowerCase().includes(q);
    });
  }, [items, query]);
  return (
    <>
      <SearchBar
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={(_q) => { /* no-op submit */ }}
      />
      {filteredItems.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-8">
          <h1 className="text-2xl font-medium">No media items found</h1>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <MediaGalleryCard
              key={idx}
              image={`https:${item.fields.img.fields.file.url}`}
              title={item.fields.title}
              isVideo={item.fields.img.isVideo}
              onClick={() => {
                if (!item.fields.img.isVideo) {
                  openViewer(`https:${item.fields.img.fields.file.url}`, item.fields.title);
                }
              }}
            />
          ))}
        </div>
      )}
      <ImageViewer
        open={viewerOpen}
        src={viewerSrc}
        alt={viewerAlt}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
};

export default MediaGalleryGrid;