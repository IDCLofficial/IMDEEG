import React from "react";
import MediaGalleryCard from "./MediaGalleryCard";
import { MediaItem } from "./mediaData";

interface MediaGalleryGridProps {
  items: MediaItem[];
}

const MediaGalleryGrid: React.FC<MediaGalleryGridProps> = ({ items }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <MediaGalleryCard key={item.id} image={item.img} title={item.title} isVideo={item.type === 'video'} />
      ))}
    </div>
  );
};

export default MediaGalleryGrid; 