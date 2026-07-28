// Knowledge base manager for chatbot
// Loads and manages data from various sources to inject into chat context

import { readFileSync } from 'fs';
import { join } from 'path';

export interface KnowledgeBase {
  programs: string;
  courses: string;
  lgaData: string;
  statistics: string;
  websiteContent: string;
}

interface TrainingData {
  NAME?: string;
  GENDER?: string;
  COURSE?: string;
  LGA?: string;
  [key: string]: string | undefined;
}

interface WebsiteSection {
  heading: string;
  content: string;
}

interface WebsiteLink {
  text: string;
  url?: string;
}

interface WebsitePage {
  label: string;
  path: string;
  url?: string;
  textContent?: string;
  sections?: WebsiteSection[];
  links?: WebsiteLink[];
}

interface WebsiteContentData {
  timestamp?: string;
  source?: string;
  pages: WebsitePage[];
}

// Load knowledge base from various sources
export async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  try {
    // Load website scrape data first (most comprehensive)
    let websiteContent = '';
    try {
      const publicDir = join(process.cwd(), 'public');
      const websiteContentPath = join(publicDir, 'website-content.json');
      const websiteContentRaw = readFileSync(websiteContentPath, 'utf-8');
      const websiteData = JSON.parse(websiteContentRaw);
      websiteContent = processWebsiteContent(websiteData);
    } catch (_e) {
      console.warn('Website content file not available. Run: npm run scrape:website');
    }

    // Load training data (actual training participants)
    const publicDir = join(process.cwd(), 'public');
    const websiteDataPath = join(publicDir, 'WEBSITE_DATA.json');
    const websiteDataRaw = readFileSync(websiteDataPath, 'utf-8');
    const websiteData = JSON.parse(websiteDataRaw);
    
    // Aggregate statistics from actual data
    const stats = aggregateStatistics(websiteData);
    const courseSummary = generateCourseSummary(websiteData);
    const lgaSummary = generateLGASummary(websiteData);

    return {
      programs: generateProgramsKnowledge(),
      courses: courseSummary,
      lgaData: lgaSummary,
      statistics: stats,
      websiteContent,
    };
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    // Return default knowledge base if loading fails
    return {
      programs: generateProgramsKnowledge(),
      courses: "Training courses are available across multiple difficulty levels.",
      lgaData: "Programs cover all 27 Local Government Areas in Imo State.",
      statistics: "Data is being collected and updated regularly.",
      websiteContent: "Website content is being loaded.",
    };
  }
}

function processWebsiteContent(websiteData: WebsiteContentData): string {
  if (!websiteData || !websiteData.pages) {
    return '';
  }

  const contentParts: string[] = [];

  // Process each page
  websiteData.pages.forEach((page: WebsitePage) => {
    contentParts.push(`\n### ${page.label}`);
    
    // Add text content
    if (page.textContent) {
      const truncated = page.textContent.slice(0, 800); // Limit content size
      contentParts.push(truncated);
    }

    // Add key sections
    if (page.sections && page.sections.length > 0) {
      page.sections.slice(0, 3).forEach((section: WebsiteSection) => {
        contentParts.push(`**${section.heading}:** ${section.content}`);
      });
    }

    // Add important links
    if (page.links && page.links.length > 0) {
      const importantLinks = page.links
        .slice(0, 5)
        .map((link: WebsiteLink) => `- ${link.text}`)
        .join('\n');
      if (importantLinks) {
        contentParts.push(`**Key Links:**\n${importantLinks}`);
      }
    }
  });

  return contentParts.join('\n\n');
}

function generateProgramsKnowledge(): string {
  return `
SKILLUP IMO PROGRAMS:
- Program Overview: Comprehensive digital skills training initiative
- Duration: Multi-month programs with flexible scheduling
- Delivery: In-person and online options available
- Certification: Participants receive certificates upon completion
- Placement Support: Career guidance and job placement assistance
- Materials: Free training materials and resources provided
- Prerequisites: Basic literacy; no prior tech experience required
  `;
}

function aggregateStatistics(data: TrainingData[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return "Live statistics are being updated in real-time.";
  }

  // Filter valid data
  const validData = data.filter(
    (item) =>
      item.NAME &&
      item.NAME !== 'TOTAL 28039' &&
      item.NAME !== null &&
      item.NAME.trim() !== ''
  );

  const totalParticipants = validData.length;
  
  // Gender distribution
  const genderCounts = validData.reduce(
    (acc: Record<string, number>, item: TrainingData) => {
      const gender = (item.GENDER || '').trim().toUpperCase();
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    },
    {}
  );

  // Course distribution
  const courseCounts = validData.reduce(
    (acc: Record<string, number>, item: TrainingData) => {
      const course = (item.COURSE || '').trim();
      if (course) {
        acc[course] = (acc[course] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const topCourses = Object.entries(courseCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([course, count]) => `${course}: ${count} participants`)
    .join('\n');

  return `
CURRENT TRAINING STATISTICS:
- Total Participants Trained: ${totalParticipants.toLocaleString()}
- Gender Distribution: ${Object.entries(genderCounts)
    .map(([gender, count]) => `${gender}: ${count}`)
    .join(', ')}
- Active Training Courses: ${Object.keys(courseCounts).length}
- Top 5 Most Popular Courses:
${topCourses}
  `;
}

function generateCourseSummary(data: TrainingData[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return "30+ training courses are available in digital skills.";
  }

  const courses = new Set<string>();
  data.forEach((item: TrainingData) => {
    if (item.COURSE && item.COURSE.trim()) {
      courses.add(item.COURSE.trim());
    }
  });

  const courseList = Array.from(courses).sort().slice(0, 20).join(', ');

  return `
AVAILABLE TRAINING COURSES:
${courseList}
Plus additional specialized courses in emerging technologies.
All courses designed for practical job market readiness.
  `;
}

function generateLGASummary(data: TrainingData[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return "Training programs cover all 27 LGAs in Imo State.";
  }

  const lgaCounts = data.reduce(
    (acc: Record<string, number>, item: TrainingData) => {
      const lga = (item.LGA || '').trim();
      if (lga) {
        acc[lga] = (acc[lga] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const topLGAs = Object.entries(lgaCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([lga, count]) => `${lga}: ${count} participants`)
    .join('\n');

  return `
COVERAGE BY LOCAL GOVERNMENT AREA:
Top 10 LGAs by Participant Count:
${topLGAs}

Training is available in all 27 LGAs across Imo State.
  `;
}

// Extract relevant information from knowledge base based on user query
export function extractRelevantContext(
  knowledgeBase: KnowledgeBase,
  userQuery: string
): string {
  const query = userQuery.toLowerCase();
  let context = '';

  // Determine which parts of the knowledge base are relevant
  if (
    query.includes('course') ||
    query.includes('training') ||
    query.includes('program')
  ) {
    context += knowledgeBase.courses + '\n';
  }

  if (query.includes('statistic') || query.includes('participant')) {
    context += knowledgeBase.statistics + '\n';
  }

  if (
    query.includes('lga') ||
    query.includes('location') ||
    query.includes('area') ||
    query.includes('region')
  ) {
    context += knowledgeBase.lgaData + '\n';
  }

  if (query.includes('program') || query.includes('skillup')) {
    context += knowledgeBase.programs + '\n';
  }

  // Include website content for general questions
  if (knowledgeBase.websiteContent && knowledgeBase.websiteContent.trim()) {
    // Always include website content as it has the most comprehensive info
    context += knowledgeBase.websiteContent + '\n';
  }

  // Always include if no specific match
  if (!context.trim()) {
    context = knowledgeBase.statistics + '\n' + knowledgeBase.courses;
  }

  return context;
}
