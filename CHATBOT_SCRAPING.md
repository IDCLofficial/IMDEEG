# Website Scraping for Chatbot Training

This guide explains how to scrape content from your IMDEEG website and feed it into the chatbot to make it more knowledgeable and useful.

## Quick Start

### 1. Run the Website Scraper

```bash
npm run scrape:website
```

This command will:
- 🕷️ Scrape all key pages from mdeeg.im.gov.ng
- 📝 Extract text content, headings, and links
- 💾 Save everything to `public/website-content.json`

Output:
```
🕷️  Starting website scrape for IMDEEG chatbot training...

📄 Scraping: Homepage...
   ✓ Extracted 12 sections and 45 links
📄 Scraping: About Us...
   ✓ Extracted 8 sections and 23 links
...

✅ Website content saved to: ./public/website-content.json
📊 Total pages scraped: 10
```

### 2. Restart Your Application

```bash
npm run dev
```

The chatbot will automatically load and use the scraped website content on the next user interaction.

## Pages Scraped

The scraper collects information from these pages:

1. **Homepage** (`/`) - Main landing page, overview
2. **About Us** (`/about-us`) - Organization mission, vision, history
3. **Data & Statistics** (`/data`) - Training metrics, analytics
4. **Departments** (`/departments`) - Ministry departments, structure
5. **Contact Us** (`/contact-us`) - Contact information, locations
6. **Projects** (`/projects`) - Ongoing initiatives
7. **Events** (`/events`) - News, events, announcements
8. **News & Updates** (`/news`) - Latest updates
9. **Media** (`/media`) - Images, videos, resources
10. **Registration** (`/register`) - Application information

## How It Works

### Architecture

```
Website (mdeeg.im.gov.ng)
         ↓
    Scraper Script (scrape-website.mjs)
         ↓
  website-content.json (public/)
         ↓
  Knowledge Base (knowledge-base.ts)
         ↓
  Chatbot Service (service.ts)
         ↓
  User Query → Relevant Context → AI Response
```

### Data Flow

1. **Scraper** extracts:
   - Full page text content
   - Section headings and content
   - Links and navigation

2. **Knowledge Base** processes:
   - Combines all extracted text
   - Creates searchable context
   - Intelligently filters by user query

3. **Chatbot** uses:
   - Website context for complete answers
   - Training statistics for numbers
   - Program details for specifics

## Example: Before & After

### Before Scraping
**User:** "Tell me about IMDEEG"
**Bot:** "IMDEEG is the Imo State Ministry of Digital Economy and eGovernment..."
(Limited to system prompt info)

### After Scraping
**User:** "Tell me about IMDEEG"
**Bot:** "IMDEEG is committed to [actual website content], with focus on [real programs], located at [actual address], offering [actual services]..."
(Uses comprehensive website information)

## Advanced: Adding More Pages

Edit `scripts/scrape-website.mjs` to add more pages:

```javascript
const PAGES_TO_SCRAPE = [
  { path: '/', label: 'Homepage' },
  { path: '/about-us', label: 'About Us' },
  // Add more pages here:
  { path: '/internships', label: 'Internship Program' },
  { path: '/blog', label: 'Blog' },
  // ... etc
];
```

Then re-run:
```bash
npm run scrape:website
```

## Troubleshooting

### "Website content file not available"
- Run: `npm run scrape:website`
- Check that `public/website-content.json` was created
- Verify the website URL is accessible

### Scraper times out
- Check your internet connection
- Verify mdeeg.im.gov.ng is accessible
- Try running again (temporary network issues)

### Chatbot gives old information
- The scraper runs on-demand (not automatic)
- Run `npm run scrape:website` to refresh content
- Consider setting up a scheduled task for regular updates

## Automation (Optional)

To automatically scrape website content daily, add to your deployment/build process:

### GitHub Actions (CI/CD)
Add `.github/workflows/scrape-daily.yml`:
```yaml
name: Daily Website Scrape

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node scripts/scrape-website.mjs
      - run: git add public/website-content.json
      - run: git commit -m "chore: update scraped website content"
      - run: git push
```

### Local Cron Job
```bash
# Add to crontab (run daily at 3 AM)
0 3 * * * cd /path/to/IMDEEG && node scripts/scrape-website.mjs
```

## Performance Notes

- Scraping takes ~10-30 seconds depending on website size
- Generated JSON file is ~1-2 MB (compresses well)
- Chatbot loads content only when needed
- No impact on production performance

## What Gets Included in Chatbot

The bot now knows about:

✅ **From Website Content:**
- Page titles and sections
- Organization structure
- Programs and services
- Contact information
- Important links and navigation
- News and updates
- Any content published on your site

✅ **From Training Data:**
- Live participant statistics
- Course enrollment numbers
- LGA distribution
- Gender demographics

✅ **From Config:**
- Program details
- Mission and vision
- Communication guidelines

## Manual Content Updates

If you want to add specific information without waiting for scraping:

Edit `lib/chatbot/config.ts` and add to `CHAT_SYSTEM_PROMPT`:

```typescript
export const CHAT_SYSTEM_PROMPT = [
  // ... existing content ...
  "",
  "LATEST ANNOUNCEMENTS:",
  "- New initiative: [details]",
  "- Upcoming event: [date and details]",
  // ... etc
].join(" ");
```

## Security & Privacy

- Scraper only reads public pages
- No login credentials needed
- Content stored locally in `public/`
- No personal data is scraped
- Website must be publicly accessible

## Questions?

Check the knowledge base setup at:
- `lib/chatbot/knowledge-base.ts` - Data loading and processing
- `lib/chatbot/service.ts` - How context is injected
- `scripts/scrape-website.mjs` - Scraper implementation
