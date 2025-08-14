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
      filtered = filtered.filter(item => item.LGA === selectedLGA);
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedCourse, selectedLGA, data]);

  // Function to normalize course names (same as in other components)
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