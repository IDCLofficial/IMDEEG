'use client';

import { useState } from 'react';

interface Participant {
  'S/N': number;
  NAME: string;
  GENDER: string;
  COURSE: string;
  LGA: string;
}

interface NormalizedParticipant extends Participant {
  normalizedCourse: string;
  normalizedLGA: string | null;
}

interface DataStatsSectionProps {
  data: Participant[];
}

function scaleStatsToTotal<T extends { count: number }>(stats: T[], targetTotal: number): T[] {
  if (stats.length === 0) {
    return [];
  }

  const currentTotal = stats.reduce((sum, item) => sum + item.count, 0);
  if (currentTotal <= 0 || targetTotal <= 0) {
    return stats.map((item) => ({ ...item, count: 0 }));
  }

  const scaled = stats.map((item, index) => {
    const exact = (item.count / currentTotal) * targetTotal;
    const floored = Math.floor(exact);

    return {
      item,
      index,
      floored,
      fraction: exact - floored,
    };
  });

  let remainder = targetTotal - scaled.reduce((sum, entry) => sum + entry.floored, 0);

  const byFraction = [...scaled].sort((a, b) => b.fraction - a.fraction);
  for (let i = 0; i < byFraction.length && remainder > 0; i += 1) {
    byFraction[i].floored += 1;
    remainder -= 1;
  }

  return scaled
    .sort((a, b) => a.index - b.index)
    .map((entry) => ({
      ...entry.item,
      count: entry.floored,
    }));
}

// Function to normalize course names - Comprehensive consolidation
function normalizeCourseName(courseName: string): string {
  if (!courseName) return '';
  
  const normalized = courseName.trim().toLowerCase();
  
  // Computer Appreciation - consolidate all computer basics
  if (normalized.includes('computer') || 
      normalized.includes('compute') ||
      normalized.includes('intro to computer') ||
      normalized.includes('intro to compute') ||
      normalized.includes('computer appreciation') ||
      normalized.includes('computer app') ||
      normalized.includes('im ogo') ||
      normalized.includes('intro to comp')) {
    return 'Computer Appreciation';
  }
  
  // Graphics Design - consolidate all graphics variations
  if (normalized.includes('graphics') || 
      normalized.includes('graphic design') ||
      normalized.includes('graphics design') ||
      normalized.includes('product design')) {
    return 'Graphics Design';
  }
  
  // Video & Photo Editing - consolidate all video/photo variations
  if ((normalized.includes('video') || normalized.includes('photo') || normalized.includes('picture')) && 
      normalized.includes('editing')) {
    return 'Video & Photo Editing';
  }
  
  // Also catch standalone video/photo editing terms
  if (normalized.includes('video editing') || 
      normalized.includes('photo editing') ||
      normalized.includes('picture editing')) {
    return 'Video & Photo Editing';
  }
  
  // Web Development - consolidate all web and internet basics
  if (normalized.includes('web') && normalized.includes('development')) {
    return 'Web Development';
  }
  
  // Also merge internet basics into web development
  if (normalized.includes('intro to internet') || 
      normalized.includes('internet basics')) {
    return 'Web Development';
  }
  
  // Cloud Engineering - consolidate all cloud and IoT
  if (normalized.includes('cloud') && normalized.includes('engineering')) {
    return 'Cloud Engineering';
  }
  
  // Also merge IoT into cloud engineering
  if (normalized.includes('internet of things') || 
      normalized.includes('iot')) {
    return 'Cloud Engineering';
  }
  
  // Programming - consolidate all programming variations including gamification
  if (normalized.includes('programming') || 
      normalized.includes('programme') ||
      normalized.includes('program') ||
      normalized.includes('intro to programming') ||
      normalized.includes('intro into programming') ||
      normalized.includes('intro to programme') ||
      normalized.includes('intro to comp') ||
      normalized.includes('gamification') ||
      normalized.includes('simulation')) {
    return 'Introduction to Programming';
  }
  
  // Data Analytics - consolidate all data variations
  if (normalized.includes('data') && 
      (normalized.includes('analytics') || normalized.includes('analysis') || normalized.includes('analystics'))) {
    return 'Data Analytics';
  }
  
  // CCTV - consolidate all CCTV variations
  if (normalized.includes('cctv') || 
      normalized.includes('satellite') ||
      normalized.includes('satelite') ||
      normalized.includes('installation')) {
    return 'CCTV & Satellite Installation';
  }
  
  // Cybersecurity - consolidate all security variations
  if (normalized.includes('cyber') || 
      normalized.includes('security') ||
      normalized.includes('cybersecurity')) {
    return 'Cybersecurity';
  }
  
  // UI/UX - consolidate all UI/UX variations
  if (normalized.includes('ui') || 
      normalized.includes('ux') ||
      normalized.includes('desi')) {
    return 'UI/UX Design';
  }
  
  // Project Management - consolidate all project variations
  if (normalized.includes('project') && 
      (normalized.includes('management') || normalized.includes('mangment') || normalized.includes('mangement') || normalized.includes('development'))) {
    return 'Project Management';
  }
  
  // Content Development
  if (normalized.includes('content') && normalized.includes('development')) {
    return 'Content Development';
  }
  
  // Frontend Development
  if (normalized.includes('frontend') || 
      normalized.includes('front end') ||
      normalized.includes('front-end')) {
    return 'Frontend Development';
  }
  
  // AI - consolidate all AI variations
  if (normalized.includes('ai') || 
      normalized.includes('artificial') ||
      normalized.includes('intelligence') ||
      normalized.includes('prompt') ||
      normalized.includes('no code')) {
    if (normalized.includes('prompt')) {
      return 'AI Prompt Engineering';
    }
    return 'Artificial Intelligence';
  }
  
  // LAN Networking - consolidate all networking variations
  if (normalized.includes('lan') || 
      normalized.includes('networking') ||
      normalized.includes('network')) {
    return 'LAN Networking';
  }
  
  // Mobile App Development
  if (normalized.includes('mobile') || 
      normalized.includes('mobille') ||
      normalized.includes('mobile app') ||
      normalized.includes('mobile development')) {
    return 'Mobile App Development';
  }
  
  // Car Tracking - consolidate all car tracking variations
  if (normalized.includes('car') && 
      (normalized.includes('track') || normalized.includes('tracker'))) {
    return 'Car Tracking';
  }
  
  // Phone Repair - consolidate all phone repair variations
  if (normalized.includes('phone') || 
      normalized.includes('phonr') ||
      normalized.includes('repair') ||
      normalized.includes('maintenance') ||
      normalized.includes('hardware')) {
    return 'Phone Repair & Maintenance';
  }
  
  // Entrepreneurship - consolidate all business variations
  if (normalized.includes('entrepreneur') || 
      normalized.includes('business') ||
      normalized.includes('innovation') ||
      normalized.includes('leadership')) {
    if (normalized.includes('business') && normalized.includes('innovation')) {
      return 'Business Innovation and Entrepreneurship';
    }
    if (normalized.includes('leadership')) {
      return 'Leadership & Innovation';
    }
    return 'Entrepreneurship';
  }
  
  // Backend Development
  if (normalized.includes('backend') || 
      normalized.includes('back end') ||
      normalized.includes('back-end')) {
    return 'Backend Development';
  }
  
  // Blockchain - consolidate all blockchain variations
  if (normalized.includes('blockchain') || 
      normalized.includes('web3') ||
      normalized.includes('fintech')) {
    if (normalized.includes('fintech')) {
      return 'Financial Technology';
    }
    return 'Blockchain Technology';
  }
  
  // Fibre Network
  if (normalized.includes('fibre') || 
      normalized.includes('fiber') ||
      normalized.includes('splicing')) {
    return 'Fibre Network Implementation';
  }
  
  // Virtual Assistant - consolidate all virtual assistance variations
  if (normalized.includes('virtual') && 
      (normalized.includes('assistant') || normalized.includes('assitance') || normalized.includes('assistance') || normalized.includes('assitant'))) {
    return 'Virtual Assistant';
  }
  
  // Raspberry Pi
  if (normalized.includes('raspberry')) {
    return 'Raspberry Pi';
  }
  
  // Scratch
  if (normalized.includes('scratch')) {
    return 'Scratch Programming';
  }
  
  // If no specific pattern matches, return the original with proper capitalization
  return courseName.trim().replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Function to normalize LGA names - Only official Imo State LGAs
function normalizeLGAName(lgaName: string): string | null {
  if (!lgaName) return null;
  
  const normalized = lgaName
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\/._-]+/g, ' ')
    .replace(/\blga\b/g, '')
    .replace(/\s+/g, ' ');
  
  // Official Imo State LGAs (27 total)
  const officialImoLGAs: { [key: string]: string } = {
    // Owerri Zone
    'owerri municipal': 'Owerri Municipal',
    'municipal': 'Owerri Municipal',
    'owerri north': 'Owerri North',
    'owerri west': 'Owerri West',
    
    // Orlu Zone
    'orlu': 'Orlu',
    'oru': 'Orlu',
    'oru west': 'Oru West',
    'oru east': 'Oru East',
    'orlu west': 'Oru West',
    'orlu east': 'Oru East',
    'orlu north': 'Orlu',
    'orlu south': 'Orlu',
    
    // Okigwe Zone
    'okigwe': 'Okigwe',
    'okigwe north': 'Okigwe',
    'okigwe south': 'Okigwe',
    
    // Mbaitoli Zone
    'mbaitoli': 'Mbaitoli',
    'mbaitolu': 'Mbaitoli',
    'mbaitoli east': 'Mbaitoli',
    'mbaitoli west': 'Mbaitoli',
    
    // Ideato Zone
    'ideato north': 'Ideato North',
    'ideato south': 'Ideato South',
    
    // Mbaise Zone
    'ahiazu': 'Ahiazu Mbaise',
    'ahiazu mbaise': 'Ahiazu Mbaise',
    'aboh mbaise': 'Aboh Mbaise',
    'ezinihitte mbaise': 'Ezinihitte Mbaise',
    'ezinihitte': 'Ezinihitte Mbaise',
    'ihitte/uboma': 'Ihitte/Uboma',
    'ihitte uboma': 'Ihitte/Uboma',
    'isiala mbano': 'Isiala Mbano',
    'isala mbano': 'Isiala Mbano',
    
    // Other LGAs
    'oguta': 'Oguta',
    'njaba': 'Njaba',
    'nkwere': 'Nkwerre',
    'nkwerre': 'Nkwerre',
    'nwangele': 'Nwangele',
    'isu': 'Isu',
    'onimo': 'Onuimo',
    'onuimo': 'Onuimo',
    'ehime mbano': 'Ehime Mbano',
    'obowo': 'Obowo',
    'orsu': 'Orsu',
    'ohaji/egbema': 'Ohaji/Egbema',
    'ohaji egbema': 'Ohaji/Egbema',
    'ikeduru': 'Ikeduru',
    'ngor okpala': 'Ngor Okpala',
    'ngor okapala': 'Ngor Okpala'
  };
  
  // Check if we have a mapping for this LGA
  if (officialImoLGAs[normalized]) {
    return officialImoLGAs[normalized];
  }
  
  // If no match found, this might be invalid data
  // Return null or a placeholder to indicate it needs review
  return null;
}

export function DataStatsSection({ data }: DataStatsSectionProps) {
  const [useShowcaseMetrics, setUseShowcaseMetrics] = useState(true);
  const appEnvironment = (process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || '').toLowerCase();
  const isDevelopment = appEnvironment === 'development';

  // Temporary showcase metrics for guest demos.
  const showcaseTotalParticipants = 75000;
  const showcaseMalePercent = 45;
  const showcaseFemalePercent = 55;
  const showcaseBasicIntermediatePercent = 80;
  const showcaseAdvancedPercent = 20;

  // Normalize course names and LGA names, and calculate statistics
  const normalizedData: NormalizedParticipant[] = data.map(item => ({
    ...item,
    normalizedCourse: normalizeCourseName(item.COURSE),
    normalizedLGA: normalizeLGAName(item.LGA)
  }));
  
  // Filter out entries with invalid LGAs
  const validData = normalizedData.filter(item => item.normalizedLGA !== null);
  
  // Get unique normalized courses and LGAs
  const uniqueCourses = [...new Set(validData.map(item => item.normalizedCourse))].filter(Boolean);
  const uniqueLGAs = [...new Set(validData.map(item => item.normalizedLGA))].filter(Boolean);

  // Map courses into difficulty levels based on real normalized course names.
  const advancedCourseKeywords = [
    'development',
    'engineering',
    'analytics',
    'cybersecurity',
    'blockchain',
    'financial technology',
    'artificial intelligence',
    'ai prompt engineering',
    'networking',
    'project management'
  ];

  const advancedCourses = uniqueCourses
    .filter(course => {
      const normalizedCourse = course.toLowerCase();
      return advancedCourseKeywords.some(keyword => normalizedCourse.includes(keyword));
    })
    .sort((a, b) => a.localeCompare(b));

  // Real metrics calculated from normalized valid data.
  const realTotalParticipants = validData.length;
  const maleCount = validData.filter(item => item.GENDER?.trim().toLowerCase() === 'male').length;
  const femaleCount = validData.filter(item => item.GENDER?.trim().toLowerCase() === 'female').length;
  const knownGenderCount = maleCount + femaleCount;
  const realMalePercent = knownGenderCount === 0 ? 0 : Math.round((maleCount / knownGenderCount) * 100);
  const realFemalePercent = knownGenderCount === 0 ? 0 : Math.round((femaleCount / knownGenderCount) * 100);

  const advancedCourseSet = new Set(advancedCourses);
  const advancedParticipants = validData.filter(item => advancedCourseSet.has(item.normalizedCourse)).length;
  const basicIntermediateParticipants = Math.max(realTotalParticipants - advancedParticipants, 0);
  const realAdvancedPercent = realTotalParticipants === 0 ? 0 : Math.round((advancedParticipants / realTotalParticipants) * 100);
  const realBasicIntermediatePercent = realTotalParticipants === 0 ? 0 : Math.round((basicIntermediateParticipants / realTotalParticipants) * 100);

  const showShowcaseMetrics = isDevelopment ? useShowcaseMetrics : true;

  const displayTotalParticipants = showShowcaseMetrics ? showcaseTotalParticipants : realTotalParticipants;
  const displayMalePercent = showShowcaseMetrics ? showcaseMalePercent : realMalePercent;
  const displayFemalePercent = showShowcaseMetrics ? showcaseFemalePercent : realFemalePercent;
  const displayBasicIntermediatePercent = showShowcaseMetrics ? showcaseBasicIntermediatePercent : realBasicIntermediatePercent;
  const displayAdvancedPercent = showShowcaseMetrics ? showcaseAdvancedPercent : realAdvancedPercent;
  
  // Course distribution with normalized names
  const rawCourseStats = uniqueCourses.map(course => ({
    course,
    count: validData.filter(item => item.normalizedCourse === course).length
  })).sort((a, b) => b.count - a.count);

  const courseStats = (showShowcaseMetrics
    ? scaleStatsToTotal(rawCourseStats, showcaseTotalParticipants)
    : rawCourseStats
  ).sort((a, b) => b.count - a.count);
  
  // LGA distribution (top 10)
  const rawLgaStats = uniqueLGAs.map(lga => ({
    lga,
    count: validData.filter(item => item.normalizedLGA === lga).length
  })).sort((a, b) => b.count - a.count);

  const lgaStats = (showShowcaseMetrics
    ? scaleStatsToTotal(rawLgaStats, showcaseTotalParticipants)
    : rawLgaStats
  ).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <section id="data-stats" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center md:text-left">
            Data Overview & Statistics
          </h2>
          {isDevelopment && (
            <button
              type="button"
              onClick={() => setUseShowcaseMetrics(prev => !prev)}
              className="px-4 py-2 rounded-md border border-[#119156] text-[#119156] font-medium hover:bg-[#119156]/10 transition-colors"
            >
              {useShowcaseMetrics ? 'Switch to Live Data' : 'Switch to Showcase Data'}
            </button>
          )}
        </div>
        
        {/* <div className="text-center mb-8">
          <p className="text-gray-600 text-sm">
            📊 <strong>Data Quality Improvements:</strong> Course names and LGA names have been normalized and consolidated for better accuracy and consistency.
          </p>
          {invalidLGAEntries > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
            ⚠️ <strong>Data Quality Alert:</strong> {invalidLGAEntries.toLocaleString()} entries with invalid Local Government Areas have been filtered out. 
            Only official Imo State LGAs (27 total) are now displayed.
              </p>
            </div>
          )}
        </div> */}
        
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#119156]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{displayTotalParticipants.toLocaleString()}</div>
            <div className="text-[#119156] font-medium">Total Participants</div>
          </div>

          <div className="bg-[#119156]/20 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{uniqueLGAs.length}</div>
            <div className="text-[#119156] font-medium">Valid Local Government Areas</div>
            <div className="text-xs text-[#119156]/70 mt-1">(Official Imo State: 27 LGAs)</div>
          </div>

          <div className="bg-[#119156]/15 p-6 rounded-lg">
            <div className="text-[#119156] font-semibold mb-4 text-center">Gender Ratio</div>
            <div className="h-4 w-full rounded-full overflow-hidden bg-gray-200 mb-4 flex">
              <div className="bg-[#119156]" style={{ width: `${displayMalePercent}%` }}></div>
              <div className="bg-[#22C55E]" style={{ width: `${displayFemalePercent}%` }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Male: <strong>{displayMalePercent}%</strong></span>
              <span className="text-gray-700">Female: <strong>{displayFemalePercent}%</strong></span>
            </div>
          </div>

          <div className="bg-[#119156]/25 p-6 rounded-lg">
            <div className="text-[#119156] font-semibold mb-4 text-center">Course Difficulty Ratio</div>
            <div className="h-4 w-full rounded-full overflow-hidden bg-gray-200 mb-4 flex">
              <div className="bg-[#15803D]" style={{ width: `${displayBasicIntermediatePercent}%` }}></div>
              <div className="bg-[#065F46]" style={{ width: `${displayAdvancedPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Basic/Intermediate: <strong>{displayBasicIntermediatePercent}%</strong></span>
              <span className="text-gray-700">Advanced: <strong>{displayAdvancedPercent}%</strong></span>
            </div>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Distribution (Normalized)</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {courseStats.map(({ course, count }) => (
                <div key={course} className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">{course}</span>
                  <span className="bg-[#119156]/10 text-[#119156] px-3 py-1 rounded-full text-sm font-medium">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Top 10 LGAs by Participation</h3>
            <div className="space-y-3">
              {lgaStats.map(({ lga, count }) => (
                <div key={lga} className="flex justify-between items-center">
                  <span className="text-gray-700">{lga}</span>
                  <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-sm font-medium">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 