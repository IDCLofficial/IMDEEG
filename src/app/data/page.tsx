'use client';

import { useState, useEffect } from 'react';
import { DataHeroSection } from './DataHeroSection';
import { DataStatsSection } from './DataStatsSection';
import { DataTableSection } from './DataTableSection';
import { DataSearchSection } from './DataSearchSection';

interface Participant {
  'S/N': number;
  NAME: string;
  GENDER: string;
  COURSE: string;
  LGA: string;
}

export default function DataPage() {
  const [data, setData] = useState<Participant[]>([]);
  const [filteredData, setFilteredData] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/WEBSITE_DATA.json');
        const jsonData = await response.json();
        
        // Filter out entries with null names and clean the data
        const cleanData = jsonData.filter((item: { NAME: string | null }) => 
          item.NAME && 
          item.NAME !== 'TOTAL 28039' && 
          item.NAME !== null && 
          item.NAME.trim() !== ''
        );
        
        setData(cleanData);
        setFilteredData(cleanData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse) {
      // Use normalized course names for filtering
      filtered = filtered.filter(item => {
        const normalizedItemCourse = normalizeCourseName(item.COURSE);
        return normalizedItemCourse === selectedCourse;
      });
    }

    if (selectedLGA) {
      // Use normalized LGA names for filtering
      filtered = filtered.filter(item => {
        const normalizedItemLGA = normalizeLGAName(item.LGA);
        return normalizedItemLGA === selectedLGA;
      });
    }

    // Filter out entries with invalid LGAs
    filtered = filtered.filter(item => normalizeLGAName(item.LGA) !== null);

    setFilteredData(filtered);
  }, [searchTerm, selectedCourse, selectedLGA, data]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#119156] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DataHeroSection />
      <DataStatsSection data={data} />
      <DataSearchSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        selectedLGA={selectedLGA}
        setSelectedLGA={setSelectedLGA}
        data={data}
      />
      <DataTableSection data={filteredData} />
    </div>
  );
} 