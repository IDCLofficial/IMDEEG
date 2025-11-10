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
  
  const normalized = lgaName.trim().toLowerCase();
  
  // Official Imo State LGAs (27 total)
  const officialImoLGAs: { [key: string]: string } = {
    // Owerri Zone
    'owerri municipal': 'Owerri Municipal',
    'owerri north': 'Owerri North',
    'owerri west': 'Owerri West',
    
    // Orlu Zone
    'orlu': 'Orlu',
    'orlu west': 'Orlu West',
    'orlu east': 'Orlu East',
    'orlu north': 'Orlu North',
    'orlu south': 'Orlu South',
    
    // Okigwe Zone
    'okigwe': 'Okigwe',
    'okigwe north': 'Okigwe North',
    'okigwe south': 'Okigwe South',
    
    // Mbaitoli Zone
    'mbaitoli': 'Mbaitoli',
    'mbaitoli east': 'Mbaitoli East',
    'mbaitoli west': 'Mbaitoli West',
    
    // Ideato Zone
    'ideato north': 'Ideato North',
    'ideato south': 'Ideato South',
    
    // Mbaise Zone
    'ahiazu mbaise': 'Ahiazu Mbaise',
    'aboh mbaise': 'Aboh Mbaise',
    'ezinihitte mbaise': 'Ezinihitte Mbaise',
    'ihitte/uboma': 'Ihitte/Uboma',
    'ihitte uboma': 'Ihitte/Uboma',
    'isiala mbano': 'Isiala Mbano',
    
    // Other LGAs
    'oguta': 'Oguta',
    'njaba': 'Njaba',
    'nkwere': 'Nkwerre',
    'nwangele': 'Nwangele',
    'isu': 'Isu',
    'onimo': 'Onuimo',
    'ehime mbano': 'Ehime Mbano',
    'obowo': 'Obowo',
    'orsu': 'Orsu',
    'ohaji/egbema': 'Ohaji/Egbema',
    'ohaji egbema': 'Ohaji/Egbema',
    'ikeduru': 'Ikeduru',
    'ngor okpala': 'Ngor Okpala'
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
  // Normalize course names and LGA names, and calculate statistics
  const normalizedData: NormalizedParticipant[] = data.map(item => ({
    ...item,
    normalizedCourse: normalizeCourseName(item.COURSE),
    normalizedLGA: normalizeLGAName(item.LGA)
  }));
  
  // Filter out entries with invalid LGAs
  const validData = normalizedData.filter(item => item.normalizedLGA !== null);
  
  // Calculate statistics
  const totalParticipants = validData.length;
  const invalidLGAEntries = normalizedData.length - validData.length;
  
  // Get unique normalized courses and LGAs
  const uniqueCourses = [...new Set(validData.map(item => item.normalizedCourse))].filter(Boolean);
  const uniqueLGAs = [...new Set(validData.map(item => item.normalizedLGA))].filter(Boolean);
  
  // Course distribution with normalized names
  const courseStats = uniqueCourses.map(course => ({
    course,
    count: validData.filter(item => item.normalizedCourse === course).length
  })).sort((a, b) => b.count - a.count);
  
  // LGA distribution (top 10)
  const lgaStats = uniqueLGAs.map(lga => ({
    lga,
    count: validData.filter(item => item.normalizedLGA === lga).length
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <section id="data-stats" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Data Overview & Statistics
        </h2>
        
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
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#119156]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{totalParticipants.toLocaleString()}</div>
            <div className="text-[#119156] font-medium">Total Participants</div>
          </div>
          
          <div className="bg-[#119156]/20 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{uniqueLGAs.length}</div>
            <div className="text-[#119156] font-medium">Valid Local Government Areas</div>
            <div className="text-xs text-[#119156]/70 mt-1">(Official Imo State: 27 LGAs)</div>
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