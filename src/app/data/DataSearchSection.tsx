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

// Function to normalize course names (same as in DataStatsSection)
function normalizeCourseName(courseName: string): string {
  if (!courseName) return '';
  
  const normalized = courseName.trim().toLowerCase();
  
  // Computer Appreciation variations
  if (normalized.includes('computer') && (normalized.includes('appreciation') || normalized.includes('apprec'))) {
    return 'Computer Appreciation';
  }
  
  // Introduction to Computer variations
  if (normalized.includes('intro') && normalized.includes('computer')) {
    return 'Introduction to Computer';
  }
  
  // Digital Marketing variations
  if (normalized.includes('digital') && normalized.includes('marketing')) {
    return 'Digital Marketing';
  }
  
  // Graphic Design variations
  if (normalized.includes('graphic') || normalized.includes('graphics')) {
    if (normalized.includes('ii') || normalized.includes('2')) {
      return 'Graphic Design II';
    }
    return 'Graphic Design';
  }
  
  // Video/Photo Editing variations
  if ((normalized.includes('video') || normalized.includes('photo') || normalized.includes('picture')) && 
      (normalized.includes('edit') || normalized.includes('editing'))) {
    return 'Video & Photo Editing';
  }
  
  // Programming variations
  if (normalized.includes('programming') || normalized.includes('programme')) {
    return 'Introduction to Programming';
  }
  
  // Cybersecurity variations
  if (normalized.includes('cyber') || normalized.includes('security')) {
    return 'Cybersecurity';
  }
  
  // Project Management variations
  if (normalized.includes('project') && normalized.includes('management')) {
    return 'Project Management';
  }
  
  // Data Analytics variations
  if (normalized.includes('data') && (normalized.includes('analytics') || normalized.includes('analysis'))) {
    return 'Data Analytics';
  }
  
  // UI/UX variations
  if (normalized.includes('ui') || normalized.includes('ux')) {
    return 'UI/UX Design';
  }
  
  // Mobile App Development variations
  if (normalized.includes('mobile') && normalized.includes('app')) {
    return 'Mobile App Development';
  }
  
  // Front-end Development variations
  if (normalized.includes('front') && (normalized.includes('end') || normalized.includes('end'))) {
    return 'Front-end Development';
  }
  
  // Back-end Development variations
  if (normalized.includes('back') && (normalized.includes('end') || normalized.includes('end'))) {
    return 'Back-end Development';
  }
  
  // Content Development variations
  if (normalized.includes('content') && normalized.includes('development')) {
    return 'Content Development';
  }
  
  // Phone Repair variations
  if (normalized.includes('phone') && (normalized.includes('repair') || normalized.includes('maintenance'))) {
    return 'Phone Repair & Maintenance';
  }
  
  // LAN Networking variations
  if (normalized.includes('lan') || (normalized.includes('network') && !normalized.includes('social'))) {
    return 'LAN Networking';
  }
  
  // Entrepreneurship variations
  if (normalized.includes('entrepreneur') || normalized.includes('business')) {
    return 'Entrepreneurship & Business Innovation';
  }
  
  // CCTV variations
  if (normalized.includes('cctv') || normalized.includes('satellite')) {
    return 'CCTV & Satellite Installation';
  }
  
  // Car Tracking variations
  if (normalized.includes('car') && normalized.includes('track')) {
    return 'Car Tracking';
  }
  
  // Web Development variations
  if (normalized.includes('web') && normalized.includes('development')) {
    return 'Web Development';
  }
  
  // AI variations
  if (normalized.includes('ai') || normalized.includes('artificial') || normalized.includes('intelligence')) {
    if (normalized.includes('prompt')) {
      return 'AI Prompt Engineering';
    }
    return 'Artificial Intelligence';
  }
  
  // Blockchain variations
  if (normalized.includes('blockchain') || normalized.includes('web3')) {
    return 'Blockchain Technology';
  }
  
  // Cloud Engineering variations
  if (normalized.includes('cloud') && normalized.includes('engineering')) {
    return 'Cloud Engineering';
  }
  
  // Virtual Assistant variations
  if (normalized.includes('virtual') && (normalized.includes('assistant') || normalized.includes('assist'))) {
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
  
  // Leadership
  if (normalized.includes('leadership')) {
    return 'Leadership & Innovation';
  }
  
  // Fintech
  if (normalized.includes('fintech')) {
    return 'Financial Technology';
  }
  
  // IoT
  if (normalized.includes('iot') || normalized.includes('internet of things')) {
    return 'Internet of Things (IoT)';
  }
  
  // Gamification
  if (normalized.includes('gamification')) {
    return 'Gamification & Simulation';
  }
  
  // Fibre Network
  if (normalized.includes('fibre') || normalized.includes('fiber')) {
    return 'Fibre Network Implementation';
  }
  
  // If no match found, return the original course name with proper capitalization
  return courseName.trim().replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
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
    normalizedCourse: normalizeCourseName(item.COURSE)
  }));
  
  const uniqueCourses = [...new Set(normalizedData.map(item => item.normalizedCourse))].filter(Boolean).sort();
  const uniqueLGAs = [...new Set(normalizedData.map(item => item.LGA))].filter(Boolean).sort();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('');
    setSelectedLGA('');
  };

  return (
    <section className="py-12 bg-gray-100">
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