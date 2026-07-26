import fs from 'node:fs';

const pagePath = 'src/app/(main)/data/page.tsx';
const jsonPath = 'public/WEBSITE_DATA.json';

const pageSource = fs.readFileSync(pagePath, 'utf8');
const blockMatch = pageSource.match(/const officialImoLGAs:[\s\S]*?=\s*\{([\s\S]*?)\n\s*\};/);

if (!blockMatch) {
  console.error('Could not find officialImoLGAs mapping in data page.');
  process.exit(1);
}

const body = blockMatch[1];
const keyRegex = /'([^']+)'\s*:/g;
const allowed = new Set();
let m;

while ((m = keyRegex.exec(body)) !== null) {
  allowed.add(m[1]);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const clean = data.filter((item) => item.NAME && item.NAME !== 'TOTAL 28039' && String(item.NAME).trim() !== '');

function normalizeLgaForLookup(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\/._-]+/g, ' ')
    .replace(/\blga\b/g, '')
    .replace(/\s+/g, ' ');
}

const valid = clean.filter((item) => allowed.has(normalizeLgaForLookup(item.LGA)));
const invalid = clean.filter((item) => !allowed.has(normalizeLgaForLookup(item.LGA)));

const invalidLgaCounts = new Map();
for (const row of invalid) {
  const lga = row.LGA == null || String(row.LGA).trim() === '' ? '(blank)' : String(row.LGA);
  invalidLgaCounts.set(lga, (invalidLgaCounts.get(lga) ?? 0) + 1);
}

const topInvalid = [...invalidLgaCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);

console.log(`allowed lga keys: ${allowed.size}`);
console.log(`json total: ${data.length}`);
console.log(`after name clean: ${clean.length}`);
console.log(`after valid-lga filter: ${valid.length}`);
console.log(`excluded by lga filter: ${invalid.length}`);
console.log('top excluded LGAs:');
for (const [lga, count] of topInvalid) {
  console.log(`${count}\t${lga}`);
}
