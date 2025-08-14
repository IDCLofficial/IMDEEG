interface Participant {
  'S/N': number;
  NAME: string;
  GENDER: string;
  COURSE: string;
  LGA: string;
}

interface DataStatsSectionProps {
  data: Participant[];
}

// Function to normalize course names
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

export function DataStatsSection({ data }: DataStatsSectionProps) {
  // Normalize course names and calculate statistics
  const normalizedData = data.map(item => ({
    ...item,
    normalizedCourse: normalizeCourseName(item.COURSE)
  }));
  
  // Calculate statistics
  const totalParticipants = normalizedData.length;
  
  // Get unique normalized courses and LGAs
  const uniqueCourses = [...new Set(normalizedData.map(item => item.normalizedCourse))].filter(Boolean);
  const uniqueLGAs = [...new Set(normalizedData.map(item => item.LGA))].filter(Boolean);
  
  // Course distribution with normalized names
  const courseStats = uniqueCourses.map(course => ({
    course,
    count: normalizedData.filter(item => item.normalizedCourse === course).length
  })).sort((a, b) => b.count - a.count);
  
  // LGA distribution (top 10)
  const lgaStats = uniqueLGAs.map(lga => ({
    lga,
    count: normalizedData.filter(item => item.LGA === lga).length
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Data Overview & Statistics
        </h2>
        
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#119156]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{totalParticipants.toLocaleString()}</div>
            <div className="text-[#119156] font-medium">Total Participants</div>
          </div>
          
          <div className="bg-[#119156]/20 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{uniqueLGAs.length}</div>
            <div className="text-[#119156] font-medium">Local Government Areas</div>
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