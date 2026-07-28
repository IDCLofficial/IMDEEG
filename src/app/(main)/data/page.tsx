'use client';

import { useState, useEffect } from 'react';
import { DataHeroSection } from './DataHeroSection';
import { DataTabsSection } from './DataTabsSection';
import { SkillupIMOSection } from './SkillupIMOSection';
import { BroadbandInfrastructureSection } from './BroadbandInfrastructureSection';

interface Participant {
  'S/N': number;
  NAME: string;
  GENDER: string;
  COURSE: string;
  LGA: string;
}

const TABS = [
  { id: 'skillupimo', label: 'Skillup Imo Data', icon: '🎓' },
  { id: 'broadband', label: 'Broadband Infrastructure Data', icon: '📡' },
];

export default function DataPage() {
  const [activeTab, setActiveTab] = useState('skillupimo');
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

  // Filter data based on search and selected options
  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter(item => {
        const normalizedItemCourse = normalizeCourseName(item.COURSE);
        return normalizedItemCourse === selectedCourse;
      });
    }

    if (selectedLGA) {
      filtered = filtered.filter(item => {
        const normalizedItemLGA = normalizeLGAName(item.LGA);
        return normalizedItemLGA === selectedLGA;
      });
    }

    // Filter out entries with invalid LGAs
    filtered = filtered.filter(item => normalizeLGAName(item.LGA) !== null);

    setFilteredData(filtered);
  }, [searchTerm, selectedCourse, selectedLGA, data]);

  // Normalization functions
  function normalizeCourseName(courseName: string): string {
    if (!courseName) return '';
    
    const normalized = courseName.trim().toLowerCase();
    
    if (normalized.includes('computer') || normalized.includes('compute') || normalized.includes('intro to computer') ||
        normalized.includes('intro to compute') || normalized.includes('computer appreciation') ||
        normalized.includes('computer app') || normalized.includes('im ogo') || normalized.includes('intro to comp')) {
      return 'Computer Appreciation';
    }
    
    if (normalized.includes('graphics') || normalized.includes('graphic design') ||
        normalized.includes('graphics design') || normalized.includes('product design')) {
      return 'Graphics Design';
    }
    
    if ((normalized.includes('video') || normalized.includes('photo') || normalized.includes('picture')) && 
        normalized.includes('editing')) {
      return 'Video & Photo Editing';
    }
    
    if (normalized.includes('video editing') || normalized.includes('photo editing') || normalized.includes('picture editing')) {
      return 'Video & Photo Editing';
    }
    
    if (normalized.includes('web') && normalized.includes('development')) {
      return 'Web Development';
    }
    
    if (normalized.includes('intro to internet') || normalized.includes('internet basics')) {
      return 'Web Development';
    }
    
    if (normalized.includes('cloud') && normalized.includes('engineering')) {
      return 'Cloud Engineering';
    }
    
    if (normalized.includes('internet of things') || normalized.includes('iot')) {
      return 'Cloud Engineering';
    }
    
    if (normalized.includes('programming') || normalized.includes('programme') || normalized.includes('program') ||
        normalized.includes('intro to programming') || normalized.includes('intro into programming') ||
        normalized.includes('intro to programme') || normalized.includes('intro to comp') ||
        normalized.includes('gamification') || normalized.includes('simulation')) {
      return 'Introduction to Programming';
    }
    
    if (normalized.includes('data') && 
        (normalized.includes('analytics') || normalized.includes('analysis') || normalized.includes('analystics'))) {
      return 'Data Analytics';
    }
    
    if (normalized.includes('cctv') || normalized.includes('satellite') ||
        normalized.includes('satelite') || normalized.includes('installation')) {
      return 'CCTV & Satellite Installation';
    }
    
    if (normalized.includes('cyber') || normalized.includes('security') || normalized.includes('cybersecurity')) {
      return 'Cybersecurity';
    }
    
    if (normalized.includes('ui') || normalized.includes('ux') || normalized.includes('desi')) {
      return 'UI/UX Design';
    }
    
    if (normalized.includes('project') && 
        (normalized.includes('management') || normalized.includes('mangment') || normalized.includes('mangement') || normalized.includes('development'))) {
      return 'Project Management';
    }
    
    if (normalized.includes('content') && normalized.includes('development')) {
      return 'Content Development';
    }
    
    if (normalized.includes('frontend') || normalized.includes('front end') || normalized.includes('front-end')) {
      return 'Frontend Development';
    }
    
    if (normalized.includes('ai') || normalized.includes('artificial') || normalized.includes('intelligence') ||
        normalized.includes('prompt') || normalized.includes('no code')) {
      if (normalized.includes('prompt')) return 'AI Prompt Engineering';
      return 'Artificial Intelligence';
    }
    
    if (normalized.includes('lan') || normalized.includes('networking') || normalized.includes('network')) {
      return 'LAN Networking';
    }
    
    if (normalized.includes('mobile') || normalized.includes('mobille') || 
        normalized.includes('mobile app') || normalized.includes('mobile development')) {
      return 'Mobile App Development';
    }
    
    if (normalized.includes('car') && (normalized.includes('track') || normalized.includes('tracker'))) {
      return 'Car Tracking';
    }
    
    if (normalized.includes('phone') || normalized.includes('phonr') || normalized.includes('repair') ||
        normalized.includes('maintenance') || normalized.includes('hardware')) {
      return 'Phone Repair & Maintenance';
    }
    
    if (normalized.includes('entrepreneur') || normalized.includes('business') ||
        normalized.includes('innovation') || normalized.includes('leadership')) {
      if (normalized.includes('business') && normalized.includes('innovation')) return 'Business Innovation and Entrepreneurship';
      if (normalized.includes('leadership')) return 'Leadership & Innovation';
      return 'Entrepreneurship';
    }
    
    if (normalized.includes('backend') || normalized.includes('back end') || normalized.includes('back-end')) {
      return 'Backend Development';
    }
    
    if (normalized.includes('blockchain') || normalized.includes('web3') || normalized.includes('fintech')) {
      if (normalized.includes('fintech')) return 'Financial Technology';
      return 'Blockchain Technology';
    }
    
    if (normalized.includes('fibre') || normalized.includes('fiber') || normalized.includes('splicing')) {
      return 'Fibre Network Implementation';
    }
    
    if (normalized.includes('virtual') && 
        (normalized.includes('assistant') || normalized.includes('assitance') || normalized.includes('assistance') || normalized.includes('assitant'))) {
      return 'Virtual Assistant';
    }
    
    if (normalized.includes('raspberry')) return 'Raspberry Pi';
    if (normalized.includes('scratch')) return 'Scratch Programming';
    
    return courseName.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  function normalizeGenderName(gender: string): 'Male' | 'Female' {
    if (!gender) return 'Male';
    
    const normalized = gender.trim().toLowerCase();
    
    if (normalized === 'male' || normalized === 'm') {
      return 'Male';
    }
    if (normalized === 'female' || normalized === 'f') {
      return 'Female';
    }
    
    // Default to the first character's gender interpretation if possible
    if (normalized.startsWith('m')) return 'Male';
    if (normalized.startsWith('f')) return 'Female';
    
    return 'Male'; // Default fallback
  }

  function normalizeLGAName(lgaName: string): string | null {
    if (!lgaName) return null;
    
    const normalized = lgaName.trim().toLowerCase().normalize('NFKC')
      .replace(/[\/._-]+/g, ' ').replace(/\blga\b/g, '').replace(/\s+/g, ' ');
    
    const officialImoLGAs: { [key: string]: string } = {
      'owerri municipal': 'Owerri Municipal', 'municipal': 'Owerri Municipal',
      'owerri north': 'Owerri North', 'owerri west': 'Owerri West',
      'orlu': 'Orlu', 'oru': 'Orlu', 'oru west': 'Oru West', 'oru east': 'Oru East',
      'orlu west': 'Oru West', 'orlu east': 'Oru East', 'orlu north': 'Orlu', 'orlu south': 'Orlu',
      'okigwe': 'Okigwe', 'okigwe north': 'Okigwe', 'okigwe south': 'Okigwe',
      'mbaitoli': 'Mbaitoli', 'mbaitolu': 'Mbaitoli', 'mbaitoli east': 'Mbaitoli', 'mbaitoli west': 'Mbaitoli',
      'ideato north': 'Ideato North', 'ideato south': 'Ideato South',
      'ahiazu': 'Ahiazu Mbaise', 'ahiazu mbaise': 'Ahiazu Mbaise', 'aboh mbaise': 'Aboh Mbaise',
      'ezinihitte mbaise': 'Ezinihitte Mbaise', 'ezinihitte': 'Ezinihitte Mbaise',
      'ihitte/uboma': 'Ihitte/Uboma', 'ihitte uboma': 'Ihitte/Uboma',
      'isiala mbano': 'Isiala Mbano', 'isala mbano': 'Isiala Mbano',
      'oguta': 'Oguta', 'njaba': 'Njaba', 'nkwere': 'Nkwerre', 'nkwerre': 'Nkwerre',
      'nwangele': 'Nwangele', 'isu': 'Isu', 'onimo': 'Onuimo', 'onuimo': 'Onuimo',
      'ehime mbano': 'Ehime Mbano', 'ehime mbano ': 'Ehime Mbano', 'obowo': 'Obowo',
      'orsu': 'Orsu', 'ohaji/egbema': 'Ohaji/Egbema', 'ohaji egbema': 'Ohaji/Egbema',
      'ikeduru': 'Ikeduru', 'ngor okpala': 'Ngor Okpala', 'ngor okapala': 'Ngor Okpala'
    };
    
    return officialImoLGAs[normalized] || null;
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
    <div className="min-h-screen bg-white">
      <DataHeroSection />
      <DataTabsSection 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        tabs={TABS}
      />
      {activeTab === 'skillupimo' && (
        <SkillupIMOSection 
          data={data}
          filteredData={filteredData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedLGA={selectedLGA}
          setSelectedLGA={setSelectedLGA}
          normalizeCourseName={normalizeCourseName}
          normalizeLGAName={normalizeLGAName}
          normalizeGenderName={normalizeGenderName}
        />
      )}
      {activeTab === 'broadband' && <BroadbandInfrastructureSection />}
    </div>
  );
}
