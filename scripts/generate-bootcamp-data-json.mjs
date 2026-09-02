#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const csvPath = path.resolve(projectRoot, 'data/Summer_Tech_Bootcamp_2026_with_LGA.csv');
const outputPath = path.resolve(projectRoot, 'public/SUMMER_TECH_BOOTCAMP_2026.json');

function parseCSV(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (const line of lines.slice(1)) {
    const values = parseCSVLine(line);
    const isEmptyRow = values.every((value) => String(value ?? '').trim() === '');
    if (isEmptyRow) continue;

    const row = {};
    for (let i = 0; i < headers.length; i += 1) {
      row[headers[i]] = normalizeValue(headers[i], values[i]);
    }
    rows.push(row);
  }

  return { headers, rows };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function normalizeValue(key, value) {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  if (trimmed === '') {
    return null;
  }

  const lowerKey = key.trim().toLowerCase();

  if (lowerKey === 'age') {
    const parsed = Number.parseFloat(trimmed);
    return Number.isNaN(parsed) ? trimmed : parsed;
  }

  return trimmed;
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(csvPath, 'utf8');
  const { rows } = parseCSV(csvText);

  fs.writeFileSync(outputPath, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');

  console.log(`Generated ${rows.length} records at ${outputPath}`);
}

main();
