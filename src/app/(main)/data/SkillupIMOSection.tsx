'use client';

import { useState, useMemo } from 'react';

interface Participant {
  'S/N': number;
  NAME: string;
  GENDER: string;
  COURSE: string;
  LGA: string;
}

interface SkillupIMOSectionProps {
  data: Participant[];
  filteredData: Participant[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  selectedLGA: string;
  setSelectedLGA: (lga: string) => void;
  normalizeCourseName: (course: string) => string;
  normalizeLGAName: (lga: string) => string | null;
  normalizeGenderName: (gender: string) => 'Male' | 'Female';
}

// All Imo State LGAs
const ImoStateLGAs = [
  'Owerri Municipal', 'Owerri North', 'Owerri West',
  'Orlu', 'Oru West', 'Oru East',
  'Okigwe', 'Mbaitoli',
  'Ideato North', 'Ideato South',
  'Ahiazu Mbaise', 'Aboh Mbaise', 'Ezinihitte Mbaise', 'Ihitte/Uboma', 'Isiala Mbano',
  'Oguta', 'Njaba', 'Nkwerre', 'Nwangele', 'Isu', 'Onuimo',
  'Ehime Mbano', 'Obowo', 'Orsu', 'Ohaji/Egbema', 'Ikeduru', 'Ngor Okpala'
];

// All courses
const AllCourses = [
  'Computer Appreciation', 'Introduction to Programming', 'Web Development', 'Graphics Design',
  'Video & Photo Editing', 'Data Analytics', 'Cybersecurity', 'Cloud Engineering',
  'AI Prompt Engineering', 'Artificial Intelligence', 'Backend Development', 'Frontend Development',
  'Mobile App Development', 'Project Management', 'UI/UX Design', 'LAN Networking',
  'Phone Repair & Maintenance', 'CCTV & Satellite Installation', 'Fibre Network Implementation',
  'Blockchain Technology', 'Financial Technology', 'Leadership & Innovation',
  'Business Innovation and Entrepreneurship', 'Entrepreneurship', 'Content Development',
  'Virtual Assistant', 'Raspberry Pi', 'Scratch Programming', 'Car Tracking'
];

// Course difficulty mapping
const courseDifficultyMap: { [key: string]: 'Beginner' | 'Intermediate' | 'Advanced' } = {
  'Computer Appreciation': 'Beginner',
  'Introduction to Programming': 'Beginner',
  'Web Development': 'Intermediate',
  'Graphics Design': 'Intermediate',
  'Video & Photo Editing': 'Intermediate',
  'Data Analytics': 'Advanced',
  'Cybersecurity': 'Advanced',
  'Cloud Engineering': 'Advanced',
  'AI Prompt Engineering': 'Advanced',
  'Artificial Intelligence': 'Advanced',
  'Backend Development': 'Advanced',
  'Frontend Development': 'Intermediate',
  'Mobile App Development': 'Advanced',
  'Project Management': 'Intermediate',
  'UI/UX Design': 'Intermediate',
  'LAN Networking': 'Intermediate',
  'Phone Repair & Maintenance': 'Beginner',
  'CCTV & Satellite Installation': 'Intermediate',
  'Fibre Network Implementation': 'Advanced',
  'Blockchain Technology': 'Advanced',
  'Financial Technology': 'Advanced',
  'Leadership & Innovation': 'Intermediate',
  'Business Innovation and Entrepreneurship': 'Intermediate',
  'Entrepreneurship': 'Beginner',
  'Content Development': 'Beginner',
  'Virtual Assistant': 'Beginner',
  'Raspberry Pi': 'Beginner',
  'Scratch Programming': 'Beginner',
  'Car Tracking': 'Advanced',
};

// Generate mock data with specified distributions
function generateMockData(): Participant[] {
  const totalParticipants = 75000;
  const femaleRatio = 0.55;
  const basicIntermediateRatio = 0.80;
  
  const basicIntermediateCourses = AllCourses.filter(c => {
    const difficulty = courseDifficultyMap[c];
    return difficulty === 'Beginner' || difficulty === 'Intermediate';
  });
  
  const advancedCourses = AllCourses.filter(c => courseDifficultyMap[c] === 'Advanced');
  
  const participants: Participant[] = [];
  
  for (let i = 0; i < totalParticipants; i++) {
    const isFemale = Math.random() < femaleRatio;
    const isBasicIntermediate = Math.random() < basicIntermediateRatio;
    
    const courseList = isBasicIntermediate ? basicIntermediateCourses : advancedCourses;
    const course = courseList[Math.floor(Math.random() * courseList.length)];
    const lga = ImoStateLGAs[Math.floor(Math.random() * ImoStateLGAs.length)];
    
    participants.push({
      'S/N': i + 1,
      NAME: `Participant ${i + 1}`,
      GENDER: isFemale ? 'Female' : 'Male',
      COURSE: course,
      LGA: lga
    });
  }
  
  return participants;
}

export function SkillupIMOSection({ 
  data, 
  filteredData,
  searchTerm,
  setSearchTerm,
  selectedCourse,
  setSelectedCourse,
  selectedLGA,
  setSelectedLGA,
  normalizeCourseName,
  normalizeLGAName,
  normalizeGenderName
}: SkillupIMOSectionProps) {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  const [useTemporaryData, setUseTemporaryData] = useState(isProduction);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Generate temporary data
  const temporaryData = useMemo(() => generateMockData(), []);
  
  // Use selected data source
  const activeData = useTemporaryData ? temporaryData : data;
  const activeFilteredData = useTemporaryData ? temporaryData : filteredData;

  // Get unique normalized courses and LGAs for filters
  const uniqueCourses = useMemo(() => {
    const courses = new Set(activeData.map(item => normalizeCourseName(item.COURSE)));
    return Array.from(courses).sort();
  }, [activeData, normalizeCourseName]);

  const uniqueLGAs = useMemo(() => {
    const lgas = new Set<string>();
    activeData.forEach(item => {
      const normalized = normalizeLGAName(item.LGA);
      if (normalized) lgas.add(normalized);
    });
    return Array.from(lgas).sort();
  }, [activeData, normalizeLGAName]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalParticipants = activeData.length;
    const genderStats = activeData.reduce(
      (acc, item) => {
        const normalized = normalizeGenderName(item.GENDER);
        acc[normalized] = (acc[normalized] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const courseStats = activeData.reduce(
      (acc, item) => {
        const normalized = normalizeCourseName(item.COURSE);
        acc[normalized] = (acc[normalized] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const lgaStats = activeData.reduce(
      (acc, item) => {
        const normalized = normalizeLGAName(item.LGA);
        if (normalized) {
          acc[normalized] = (acc[normalized] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const difficultyStats = activeData.reduce(
      (acc, item) => {
        const normalized = normalizeCourseName(item.COURSE);
        const difficulty = courseDifficultyMap[normalized] || 'Intermediate';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const topCourses = Object.entries(courseStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topLGAs = Object.entries(lgaStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return {
      totalParticipants,
      genderStats,
      courseStats,
      lgaStats,
      difficultyStats,
      topCourses,
      topLGAs,
    };
  }, [activeData, normalizeCourseName, normalizeLGAName, normalizeGenderName]);

  // Pagination
  const totalPages = Math.ceil(activeFilteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = activeFilteredData.slice(startIndex, startIndex + itemsPerPage);

  const maleCount = stats.genderStats['Male'] || 0;
  const femaleCount = stats.genderStats['Female'] || 0;
  
  // Use hardcoded percentages for projected data, calculated for actual data
  const malePercentage = useTemporaryData ? 45 : (stats.totalParticipants > 0 ? Math.round((maleCount / stats.totalParticipants) * 100) : 0);
  const femalePercentage = useTemporaryData ? 55 : (stats.totalParticipants > 0 ? Math.round((femaleCount / stats.totalParticipants) * 100) : 0);

  const beginnerCount = stats.difficultyStats['Beginner'] || 0;
  const intermediateCount = stats.difficultyStats['Intermediate'] || 0;
  const advancedCount = stats.difficultyStats['Advanced'] || 0;
  const basicIntermediateCount = beginnerCount + intermediateCount;
  
  // Use hardcoded percentages for projected data, calculated for actual data
  const basicIntermediatePercent = useTemporaryData ? 80 : (stats.totalParticipants > 0 ? Math.round((basicIntermediateCount / stats.totalParticipants) * 100) : 0);
  const advancedPercent = useTemporaryData ? 20 : (stats.totalParticipants > 0 ? Math.round((advancedCount / stats.totalParticipants) * 100) : 0);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Data Source Toggle - Only show in development */}
        {!isProduction && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Source</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {useTemporaryData 
                    ? 'Showing Projected Data (75,000 participants)' 
                    : 'Showing Actual Data'}
                </p>
              </div>
              <button
                onClick={() => {
                  setUseTemporaryData(!useTemporaryData);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  useTemporaryData
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {useTemporaryData ? 'Switch to Actual Data' : 'Switch to Projected Data'}
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Section - Only show for actual data */}
        {!useTemporaryData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participant Name</label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
                <select
                  value={selectedLGA}
                  onChange={(e) => {
                    setSelectedLGA(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All LGAs</option>
                  {uniqueLGAs.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Total Participants */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm font-medium mb-2">Total Participants</div>
            <div className="text-4xl font-bold text-green-600">
              {stats.totalParticipants.toLocaleString()}
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm font-medium mb-4">Gender Distribution</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Male</span>
                <span className="font-semibold text-blue-600">{malePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${malePercentage}%` }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Female</span>
                <span className="font-semibold text-green-600">{femalePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${femalePercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Total Courses */}
          {/* <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm font-medium mb-2">Training Courses</div>
            <div className="text-4xl font-bold text-orange-600">
              {Object.keys(stats.courseStats).length}
            </div>
          </div> */}
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Difficulty Distribution</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Basic/Intermediate</span>
                <span className="font-semibold text-blue-600">{basicIntermediatePercent}% ({basicIntermediateCount.toLocaleString()})</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${basicIntermediatePercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Advanced</span>
                <span className="font-semibold text-green-600">{advancedPercent}% ({advancedCount.toLocaleString()})</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${advancedPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* LGA Metrics and Training Courses - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top LGAs by Participants */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top LGAs by Participants</h3>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {stats.topLGAs.map(([lga, count]) => (
                  <div key={lga} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-800 text-sm truncate flex-1">{lga}</span>
                    <span className="font-semibold text-green-600 ml-2 flex-shrink-0">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Training Courses - Scrollable List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Training Courses</h3>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {Object.entries(stats.courseStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([course, count]) => (
                    <div key={course} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-800 text-sm truncate flex-1">{course}</span>
                      <span className="font-semibold text-green-600 ml-2 flex-shrink-0">{count.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Participant Data Table - Only show for actual data */}
        {!useTemporaryData && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Participant List
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {activeFilteredData.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, activeFilteredData.length)} of {activeFilteredData.length.toLocaleString()} participants
              </p>
            </div>

            {activeFilteredData.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No participants found matching your search criteria.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">LGA</th>
                      </tr>
                    </thead>
                  <tbody>
                    {currentData.map((participant) => {
                        const normalizedGender = normalizeGenderName(participant.GENDER);
                        return (
                        <tr key={participant['S/N']} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">{participant.NAME}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            normalizedGender === 'Male'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {normalizedGender}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{participant.COURSE}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{participant.LGA}</td>
                      </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
            </div>
          )}

        {/* Source */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          Source: Field Survey August 2024 - June 2026
        </div>
      </div>
    </section>
  );
}
