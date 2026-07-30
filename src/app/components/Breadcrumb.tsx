'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb Navigation Component
 * Improves SEO and user navigation
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-gray-50 px-4 py-3 sm:px-6 lg:px-8 ${className}`}
    >
      <ol className="flex items-center gap-2 max-w-7xl mx-auto text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <>
                <Link
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
                {index < items.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </>
            ) : (
              <>
                <span className="text-gray-600">{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
