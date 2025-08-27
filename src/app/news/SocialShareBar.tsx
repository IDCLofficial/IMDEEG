"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useState } from "react";

export default function SocialShareBar({ date, url }: { date: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Hide the message after a short delay
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-500 text-sm mb-6 bg-[#FAFBFC] px-4 py-2 w-full">
      <span>{new Date(date).toDateString()}</span>
      <span className="hidden md:inline">•</span>
      <span>Share:</span>
      <div className="flex gap-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full"
        >
          <FaFacebookF size={14} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${url}`}
          target="_blank"
          className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full"
        >
          <FaTwitter size={14} />
        </a>
        {/* <a href={`https://www.instagram.com/yourwebsite`} target="_blank" className="inline-block w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
          <FaInstagram size={14} />
        </a> */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
          target="_blank"
          className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full"
        >
          <FaLinkedinIn size={14} />
        </a>
        <button
          className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full"
          onClick={handleCopy}
          type="button"
        >
          <FiCopy size={14} />
        </button>
        {copied && <span className="text-green-500">Link copied to clipboard</span>}
      </div>
    </div>
  );
}