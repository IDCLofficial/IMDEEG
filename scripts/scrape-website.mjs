#!/usr/bin/env node

/**
 * Website Scraper for IMDEEG Chatbot
 * Scrapes content from mdeeg.im.gov.ng and exports to JSON for chatbot training
 * 
 * Usage: node scripts/scrape-website.mjs
 * Output: public/website-content.json
 */

import https from 'https';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Configuration
const WEBSITE_URL = 'https://mdeeg.im.gov.ng';
const OUTPUT_FILE = resolve('./public/website-content.json');

// Pages to scrape
const PAGES_TO_SCRAPE = [
  { path: '/', label: 'Homepage' },
  { path: '/about-us', label: 'About Us' },
  { path: '/data', label: 'Data & Statistics' },
  { path: '/departments', label: 'Departments' },
  { path: '/contact-us', label: 'Contact Us' },
  { path: '/projects', label: 'Projects' },
  { path: '/events', label: 'Events' },
  { path: '/news', label: 'News & Updates' },
  { path: '/media', label: 'Media' },
  { path: '/register', label: 'Registration' },
];

// Fetch helper
function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, WEBSITE_URL);
    
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Extract text content from HTML
function extractText(html) {
  // Remove scripts and styles
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    // Clean whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

// Extract headings and sections
function extractSections(html) {
  const sections = [];
  
  // Extract h1, h2, h3 with following content
  const headingRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>([^<]*(?:<(?!h[1-3])[^>]*>[^<]*)*)/gi;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const heading = extractText(match[1]);
    const content = extractText(match[2]).slice(0, 500); // Limit content length
    
    if (heading && content) {
      sections.push({
        heading,
        content,
      });
    }
  }
  
  return sections;
}

// Extract links
function extractLinks(html, baseUrl) {
  const links = [];
  const linkRegex = /<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = extractText(match[2]);
    
    if (text && href && !href.includes('javascript:')) {
      links.push({
        text,
        href: href.startsWith('http') ? href : new URL(href, baseUrl).href,
      });
    }
  }
  
  return links;
}

// Main scraping function
async function scrapeWebsite() {
  console.log('🕷️  Starting website scrape for IMDEEG chatbot training...\n');
  
  const scrapedData = {
    timestamp: new Date().toISOString(),
    source: WEBSITE_URL,
    pages: [],
  };
  
  for (const page of PAGES_TO_SCRAPE) {
    try {
      console.log(`📄 Scraping: ${page.label}...`);
      const html = await fetchPage(page.path);
      
      const pageData = {
        label: page.label,
        path: page.path,
        url: new URL(page.path, WEBSITE_URL).href,
        textContent: extractText(html),
        sections: extractSections(html),
        links: extractLinks(html, WEBSITE_URL),
      };
      
      scrapedData.pages.push(pageData);
      console.log(`   ✓ Extracted ${pageData.sections.length} sections and ${pageData.links.length} links`);
    } catch (error) {
      console.error(`   ✗ Error scraping ${page.label}: ${error.message}`);
    }
  }
  
  // Save to file
  try {
    mkdirSync('./public', { recursive: true });
    writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedData, null, 2));
    console.log(`\n✅ Website content saved to: ${OUTPUT_FILE}`);
    console.log(`📊 Total pages scraped: ${scrapedData.pages.length}`);
  } catch (error) {
    console.error(`❌ Error saving output: ${error.message}`);
    process.exit(1);
  }
}

// Run scraper
scrapeWebsite().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
