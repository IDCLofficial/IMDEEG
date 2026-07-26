import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('public/WEBSITE_DATA.json', 'utf8'));

function normalizeLGAName(lgaName) {
  if (!lgaName) return null;

  const normalized = String(lgaName)
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\/._-]+/g, ' ')
    .replace(/\blga\b/g, '')
    .replace(/\s+/g, ' ');

  const officialImoLGAs = {
    'owerri municipal': 'Owerri Municipal',
    'municipal': 'Owerri Municipal',
    'owerri north': 'Owerri North',
    'owerri west': 'Owerri West',
    'orlu': 'Orlu',
    'oru': 'Orlu',
    'oru west': 'Oru West',
    'oru east': 'Oru East',
    'orlu west': 'Oru West',
    'orlu east': 'Oru East',
    'orlu north': 'Orlu',
    'orlu south': 'Orlu',
    'okigwe': 'Okigwe',
    'okigwe north': 'Okigwe',
    'okigwe south': 'Okigwe',
    'mbaitoli': 'Mbaitoli',
    'mbaitolu': 'Mbaitoli',
    'mbaitoli east': 'Mbaitoli',
    'mbaitoli west': 'Mbaitoli',
    'ideato north': 'Ideato North',
    'ideato south': 'Ideato South',
    'ahiazu': 'Ahiazu Mbaise',
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

const clean = data.filter((item) => item.NAME && item.NAME !== 'TOTAL 28039' && String(item.NAME).trim() !== '');
const uniqueLGAs = [...new Set(clean.map((row) => normalizeLGAName(row.LGA)).filter(Boolean))].sort();

console.log('unique valid lgas:', uniqueLGAs.length);
console.log(uniqueLGAs.join('\n'));
