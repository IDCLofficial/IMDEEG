"use client";

import React from "react";
import { FileText, FileSpreadsheet, Image as ImageIcon, Download, ExternalLink, Folder } from "lucide-react";
import type { Publication } from "../../../../lib/types";
import { formatFileSize, formatPublicationDate, getFileIconType } from "./publications";

interface PublicationCardProps {
  publication: Publication;
  onView: (publication: Publication) => void;
  active?: boolean;
}

const ICON_MAP = {
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  image: ImageIcon,
  other: FileText,
} as const;

const ICON_STYLES = {
  pdf: "bg-red-100 text-red-600",
  doc: "bg-blue-100 text-blue-600",
  sheet: "bg-emerald-100 text-emerald-600",
  image: "bg-amber-100 text-amber-600",
  other: "bg-gray-100 text-gray-600",
} as const;

export default function PublicationCard({
  publication,
  onView,
  active = false,
}: PublicationCardProps) {
  const iconType = getFileIconType(publication.contentType, publication.filename);
  const Icon = ICON_MAP[iconType];

  const handleView = () => onView(publication);
  const handleDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      onClick={handleView}
      className={`group relative flex cursor-pointer flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        active ? "border-primary-green" : "border-gray-200"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleView();
        }
      }}
      aria-label={`Open ${publication.title}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${ICON_STYLES[iconType]}`}
          aria-hidden
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="line-clamp-2 text-base font-semibold text-gray-900 leading-snug">
            {publication.title}
          </span>
          <span className="mt-1 line-clamp-1 text-xs text-gray-500">
            {publication.filename}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
          <Folder size={12} />
          {publication.category}
        </span>
        <span>{formatPublicationDate(publication.lastModified)}</span>
        <span aria-hidden>•</span>
        <span>{formatFileSize(publication.size)}</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-green transition group-hover:text-primary-green/80"
        >
          <ExternalLink size={16} />
          View document
        </span>
        <a
          href={publication.downloadUrl}
          onClick={handleDownload}
          download={publication.filename}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800"
          aria-label={`Download ${publication.title}`}
        >
          <Download size={14} />
          Download
        </a>
      </div>
    </article>
  );
}
