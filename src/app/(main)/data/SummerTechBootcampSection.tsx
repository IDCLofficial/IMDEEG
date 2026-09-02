'use client';

import { useState, useMemo, useEffect } from 'react';

interface BootcampParticipant {
  "Participant's Full Name": string | null;
  Gender: string | null;
  "Date of Birth": string | null;
  Age: number | string | null;
  "School Name": string | null;
  "Current Class": string | null;
  "Residential Address": string | null;
  lga: string | null;
}

interface BootcampStats {
  totalParticipants: number;
  maleCount: number;
  femaleCount: number;
  ageRange: { min: number; max: number };
  lgaCount: number;
  genderStats: Record<string, number>;
  lgaStats: { lga: string; count: number }[];
  ageStats: { bracket: string; count: number }[];
}

const AGE_BRACKETS = [
  { label: '6-9', min: 6, max: 9 },
  { label: '10-12', min: 10, max: 12 },
  { label: '13-15', min: 13, max: 15 },
  { label: '16-18', min: 16, max: 18 },
  { label: '19+', min: 19, max: 99 },
];

function normalizeLGAName(lgaName: string | null): string | null {
  if (!lgaName) return null;

  const normalized = lgaName
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\/._-]+/g, ' ')
    .replace(/\blga\b/g, '')
    .replace(/\s+/g, ' ');

  const officialImoLGAs: Record<string, string> = {
    'owerri municipal': 'Owerri Municipal',
    'municipal': 'Owerri Municipal',
    'owerri north': 'Owerri North',
    'owerri west': 'Owerri West',
    'orlu': 'Orlu',
    'oru': 'Orlu',
    'oru west': 'Oru West',
    'oru east': 'Oru East',
    'mbaitoli': 'Mbaitoli',
    'mbaitolu': 'Mbaitoli',
    'ahiazu mbaise': 'Ahiazu Mbaise',
    'aboh mbaise': 'Aboh Mbaise',
    'ezinihitte mbaise': 'Ezinihitte Mbaise',
    'ezinihitte': 'Ezinihitte Mbaise',
    'ihitte/uboma': 'Ihitte/Uboma',
    'ihitte uboma': 'Ihitte/Uboma',
    'isiala mbano': 'Isiala Mbano',
    'isala mbano': 'Isiala Mbano',
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
    'ngor okapala': 'Ngor Okpala',
  };

  return officialImoLGAs[normalized] || null;
}

function normalizeGenderName(gender: string | null): 'Male' | 'Female' | 'Unknown' {
  if (!gender) return 'Unknown';
  const normalized = gender.trim().toLowerCase();
  if (normalized === 'male' || normalized === 'm') return 'Male';
  if (normalized === 'female' || normalized === 'f') return 'Female';
  if (normalized.startsWith('m')) return 'Male';
  if (normalized.startsWith('f')) return 'Female';
  return 'Unknown';
}

function parseAge(age: number | string | null): number | null {
  if (age === null || age === undefined) return null;
  if (typeof age === 'number' && !Number.isNaN(age)) return Math.floor(age);
  if (typeof age === 'string') {
    const parsed = Number.parseFloat(age.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(parsed)) return Math.floor(parsed);
  }
  return null;
}

function getAgeBracket(age: number | null): string {
  if (age === null) return 'Unknown';
  for (const bracket of AGE_BRACKETS) {
    if (age >= bracket.min && age <= bracket.max) return bracket.label;
  }
  return '19+';
}

export function SummerTechBootcampSection() {
  const [data, setData] = useState<BootcampParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/SUMMER_TECH_BOOTCAMP_2026.json');
        const jsonData = await response.json();
        setData(jsonData.filter((item: BootcampParticipant) =>
          item["Participant's Full Name"] && item["Participant's Full Name"].trim() !== ''
        ));
      } catch (error) {
        console.error('Error fetching bootcamp data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo<BootcampStats>(() => {
    const genderStats: Record<string, number> = {};
    const lgaCountMap: Record<string, number> = {};
    const ageBrackets: Record<string, number> = {};
    const validAges: number[] = [];

    AGE_BRACKETS.forEach(b => { ageBrackets[b.label] = 0; });
    ageBrackets['Unknown'] = 0;

    for (const item of data) {
      const gender = normalizeGenderName(item.Gender);
      genderStats[gender] = (genderStats[gender] || 0) + 1;

      const lga = normalizeLGAName(item.lga);
      if (lga) {
        lgaCountMap[lga] = (lgaCountMap[lga] || 0) + 1;
      }

      const age = parseAge(item.Age);
      const bracket = getAgeBracket(age);
      ageBrackets[bracket] = (ageBrackets[bracket] || 0) + 1;
      if (age !== null) validAges.push(age);
    }

    const lgaStats = Object.entries(lgaCountMap)
      .map(([lga, count]) => ({ lga, count }))
      .sort((a, b) => b.count - a.count);

    const ageStats = AGE_BRACKETS
      .map(b => ({ bracket: b.label, count: ageBrackets[b.label] || 0 }))
      .concat(ageBrackets['Unknown'] > 0 ? [{ bracket: 'Unknown', count: ageBrackets['Unknown'] }] : []);

    const maleCount = genderStats['Male'] || 0;
    const femaleCount = genderStats['Female'] || 0;

    return {
      totalParticipants: data.length,
      maleCount,
      femaleCount,
      ageRange: validAges.length > 0
        ? { min: Math.min(...validAges), max: Math.max(...validAges) }
        : { min: 0, max: 0 },
      lgaCount: lgaStats.length,
      genderStats,
      lgaStats,
      ageStats,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item["Participant's Full Name"] || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLGA) {
      filtered = filtered.filter(item => normalizeLGAName(item.lga) === selectedLGA);
    }

    if (selectedGender) {
      filtered = filtered.filter(item => normalizeGenderName(item.Gender) === selectedGender);
    }

    return filtered;
  }, [data, searchTerm, selectedLGA, selectedGender]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const uniqueLGAs = useMemo(() => {
    const lgas = new Set<string>();
    data.forEach(item => {
      const normalized = normalizeLGAName(item.lga);
      if (normalized) lgas.add(normalized);
    });
    return Array.from(lgas).sort();
  }, [data]);

  const maxLgaCount = stats.lgaStats.length > 0 ? stats.lgaStats[0].count : 1;
  const maxAgeCount = Math.max(...stats.ageStats.map(s => s.count), 1);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#119156] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bootcamp data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Summer Tech Bootcamp 2026</h2>
          <p className="text-gray-600">Participant data and distribution analysis for the 2026 cohort</p>
          <p className="text-xs text-gray-500 mt-2">Year: 2026 | Total Records: {stats.totalParticipants.toLocaleString()}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#119156]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{stats.totalParticipants.toLocaleString()}</div>
            <div className="text-[#119156] font-medium">Total Participants</div>
          </div>

          <div className="bg-[#119156]/15 p-6 rounded-lg">
            <div className="text-[#119156] font-semibold mb-4 text-center">Gender Distribution</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Male</span>
                <span className="font-semibold text-blue-600 text-sm">
                  {stats.totalParticipants > 0 ? Math.round((stats.maleCount / stats.totalParticipants) * 100) : 0}%
                  <span className="text-gray-400 font-normal ml-1">({stats.maleCount})</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.totalParticipants > 0 ? (stats.maleCount / stats.totalParticipants) * 100 : 0}%` }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Female</span>
                <span className="font-semibold text-green-600 text-sm">
                  {stats.totalParticipants > 0 ? Math.round((stats.femaleCount / stats.totalParticipants) * 100) : 0}%
                  <span className="text-gray-400 font-normal ml-1">({stats.femaleCount})</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.totalParticipants > 0 ? (stats.femaleCount / stats.totalParticipants) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#119156]/20 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">
              {stats.ageRange.min} - {stats.ageRange.max}
            </div>
            <div className="text-[#119156] font-medium">Age Range (years)</div>
          </div>

          <div className="bg-[#119156]/25 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#119156] mb-2">{stats.lgaCount}</div>
            <div className="text-[#119156] font-medium">LGAs Represented</div>
            <div className="text-xs text-[#119156]/70 mt-1">(Official Imo State: 27 LGAs)</div>
          </div>
        </div>

        {/* Distribution Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Gender Distribution Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Gender Distribution</h3>
            <div className="flex items-end justify-center gap-8 h-48">
              {['Male', 'Female'].map((gender) => {
                const count = stats.genderStats[gender] || 0;
                const pct = stats.totalParticipants > 0 ? (count / stats.totalParticipants) * 100 : 0;
                const barHeight = Math.max(pct * 1.8, 4);
                return (
                  <div key={gender} className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-700 mb-2">{count}</span>
                    <div
                      className={`w-16 rounded-t-md ${gender === 'Male' ? 'bg-blue-500' : 'bg-green-500'}`}
                      style={{ height: `${barHeight}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 font-medium">{gender}</span>
                    <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Distribution Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Distribution</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {stats.ageStats.map((stat) => {
                const barHeight = maxAgeCount > 0 ? (stat.count / maxAgeCount) * 160 : 0;
                return (
                  <div key={stat.bracket} className="flex flex-col items-center flex-1">
                    <span className="text-xs font-semibold text-gray-700 mb-1">{stat.count}</span>
                    <div
                      className="w-full bg-[#119156] rounded-t-md min-h-[4px]"
                      style={{ height: `${Math.max(barHeight, 4)}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 text-center leading-tight">{stat.bracket}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LGA Distribution Bar Chart (Top 10) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top LGAs by Participation</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {stats.lgaStats.slice(0, 10).map((stat) => {
                const barWidth = maxLgaCount > 0 ? (stat.count / maxLgaCount) * 100 : 0;
                return (
                  <div key={stat.lga} className="flex items-center gap-2">
                    <span className="text-xs text-gray-700 w-28 text-right truncate flex-shrink-0">{stat.lga}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="bg-[#22C55E] h-5 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(barWidth, 8)}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{stat.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Participant Name</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
              <select
                value={selectedLGA}
                onChange={(e) => { setSelectedLGA(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All LGAs</option>
                {uniqueLGAs.map(lga => (
                  <option key={lga} value={lga}>{lga}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSearchTerm(''); setSelectedLGA(''); setSelectedGender(''); setCurrentPage(1); }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
          {(searchTerm || selectedLGA || selectedGender) && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-[#119156]/10 text-[#119156] px-2 py-1 rounded-full text-sm">
                  Name: {searchTerm}
                </span>
              )}
              {selectedGender && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  Gender: {selectedGender}
                </span>
              )}
              {selectedLGA && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                  LGA: {selectedLGA}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Participant Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Participant List</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length.toLocaleString()} participants
            </p>
          </div>

          {filteredData.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No participants found matching your search criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">S/N</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">LGA</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((participant, index) => {
                      const gender = normalizeGenderName(participant.Gender);
                      const lga = normalizeLGAName(participant.lga);
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-500">{startIndex + index + 1}</td>
                          <td className="px-6 py-3 text-sm font-medium text-gray-900">
                            {participant["Participant's Full Name"]}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-700">
                            {parseAge(participant.Age) ?? 'N/A'}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              gender === 'Male'
                                ? 'bg-blue-100 text-blue-700'
                                : gender === 'Female'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {gender}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-700">{lga || 'N/A'}</td>
                          <td className="px-6 py-3 text-sm text-gray-700">{participant["Current Class"] || 'N/A'}</td>
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
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded ${
                              currentPage === pageNum
                                ? 'bg-[#119156] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
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

        {/* Source */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          Source: Summer Tech Bootcamp 2026 Registration Data
        </div>
      </div>
    </section>
  );
}
