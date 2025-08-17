interface Participant {
  'S/N': number;
  NAME: string;
  GENDER: string;
  COURSE: string;
  LGA: string;
}

interface DataSearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  selectedLGA: string;
  setSelectedLGA: (lga: string) => void;
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
  
  // Programming - consolidate all programming variations
  if (normalized.includes('programming') || 
      normalized.includes('programme') ||
      normalized.includes('program') ||
      normalized.includes('intro to programming') ||
      normalized.includes('intro into programming') ||
      normalized.includes('intro to programme') ||
      normalized.includes('intro to comp')) {
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
  
  // Web Development
  if (normalized.includes('web') && normalized.includes('development')) {
    return 'Web Development';
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
  return null;
}

export function DataSearchSection({ 
  searchTerm, 
  setSearchTerm, 
  selectedCourse, 
  setSelectedCourse, 
  selectedLGA, 
  setSelectedLGA, 
  data 
}: DataSearchSectionProps) {
  // Get unique normalized courses and LGAs for dropdowns
  const normalizedData = data.map(item => ({
    ...item,
    normalizedCourse: normalizeCourseName(item.COURSE),
    normalizedLGA: normalizeLGAName(item.LGA)
  }));
  
  // Filter out entries with invalid LGAs
  const validData = normalizedData.filter(item => item.normalizedLGA !== null);
  
  const uniqueCourses = [...new Set(validData.map(item => item.normalizedCourse))].filter(Boolean).sort();
  const uniqueLGAs = [...new Set(validData.map(item => item.normalizedLGA))].filter((lga): lga is string => lga !== null).sort();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('');
    setSelectedLGA('');
  };

  return (
    <section id="data-search" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Search & Filter Data</h3>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* Name Search */}
            <div>
              <label htmlFor="name-search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                id="name-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter participant name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#119156] focus:border-transparent"
              />
            </div>
            
            {/* Course Filter */}
            <div>
              <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Course
              </label>
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#119156] focus:border-transparent"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            
            {/* LGA Filter */}
            <div>
              <label htmlFor="lga-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by LGA
              </label>
              <select
                id="lga-filter"
                value={selectedLGA}
                onChange={(e) => setSelectedLGA(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#119156] focus:border-transparent"
              >
                <option value="">All LGAs</option>
                {uniqueLGAs.map(lga => (
                  <option key={lga} value={lga}>{lga}</option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || selectedCourse || selectedLGA) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-[#119156]/10 text-[#119156] px-2 py-1 rounded-full text-sm">
                  Name: {searchTerm}
                </span>
              )}
              {selectedCourse && (
                <span className="bg-[#22C55E]/10 text-[#22C55E] px-2 py-1 rounded-full text-sm">
                  Course: {selectedCourse}
                </span>
              )}
              {selectedLGA && (
                <span className="bg-[#00FF89]/10 text-[#00FF89] px-2 py-1 rounded-full text-sm">
                  LGA: {selectedLGA}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 