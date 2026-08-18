"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { Download, ExternalLink } from "lucide-react";
import type { Publication } from "../../../../lib/types";
import { formatFileSize } from "./publications";

interface PublicationViewerProps {
  open: boolean;
  publication: Publication | null;
  onClose: () => void;
}

export default function PublicationViewer({
  open,
  publication,
  onClose,
}: PublicationViewerProps) {
  const portalTarget = typeof window !== "undefined" ? document.body : null;

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !publication || !portalTarget) return null;

  const canEmbedPdf =
    publication.contentType === "application/pdf" ||
    publication.filename.toLowerCase().endsWith(".pdf");

  const content = (
    <div className="fixed inset-0 z-[10010] flex flex-col bg-black/85">
      <div
        className="absolute inset-0 bg-black/85"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-[10011] flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#111827] px-4 py-3 text-white md:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold md:text-base">
              {publication.title}
            </h2>
            <p className="truncate text-xs text-white/60">
              {publication.filename} • {formatFileSize(publication.size)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={publication.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
            >
              <ExternalLink size={14} />
              Open in new tab
            </a>
            <a
              href={publication.downloadUrl}
              download={publication.filename}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-green px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-green/80"
            >
              <Download size={14} />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="ml-1 inline-flex items-center justify-center rounded-md border border-white/20 p-1.5 text-white transition hover:bg-white/10"
              aria-label="Close document viewer"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
        <div className="relative flex-1 bg-[#0b1120]">
          {canEmbedPdf ? (
            <iframe
              key={publication.key}
              src={`${publication.viewUrl}#zoom=page-width`}
              title={publication.title}
              className="h-full w-full bg-white"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-white">
              <p className="text-lg font-semibold">
                Inline preview is not available for this file type.
              </p>
              <p className="max-w-md text-sm text-white/70">
                You can still download the file or open it in a new browser tab
                to view it.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={publication.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <ExternalLink size={16} />
                  Open in new tab
                </a>
                <a
                  href={publication.downloadUrl}
                  download={publication.filename}
                  className="inline-flex items-center gap-2 rounded-md bg-primary-green px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-green/80"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalTarget);
}
