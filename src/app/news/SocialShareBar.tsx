import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

export default function SocialShareBar({ date, url }: { date: string, url: string }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-500 text-sm mb-6 bg-[#FAFBFC] px-4 py-2 w-full">
      <span>{date}</span>
      <span className="hidden md:inline">•</span>
      <span>Share:</span>
      <div className="flex gap-2">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" className="inline-block w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
          <FaFacebookF size={14} />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${url}`} target="_blank" className="inline-block w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
          <FaTwitter size={14} />
        </a>
        <a href={`https://www.instagram.com/yourwebsite`} target="_blank" className="inline-block w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
          <FaInstagram size={14} />
        </a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`} target="_blank" className="inline-block w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
          <FaLinkedinIn size={14} />
        </a>
        <a href={url} target="_blank" className="inline-block w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
          <FiCopy size={14} />
        </a>
      </div>
    </div>
  );
} 