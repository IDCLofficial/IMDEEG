#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const csvPath = path.resolve(projectRoot, 'data/WEBSITE_DATA.csv');
const outputPath = path.resolve(projectRoot, 'public/WEBSITE_DATA.json');

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

    // Ignore trailing/comma-only rows so they do not become null-only objects.
    if (isEmptyRow) {
      continue;
    }

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

  if (key === 'S/N') {
    const parsed = Number.parseFloat(trimmed);
    return Number.isNaN(parsed) ? trimmed : parsed;
  }

  return trimmed;
}

function getReferenceKeys(referencePath) {
  if (!fs.existsSync(referencePath)) {
    return null;
  }

  try {
    const existing = JSON.parse(fs.readFileSync(referencePath, 'utf8'));

    if (Array.isArray(existing) && existing.length > 0 && typeof existing[0] === 'object' && existing[0] !== null) {
      return Object.keys(existing[0]);
    }
  } catch {
    return null;
  }

  return null;
}

function shapeRows(rows, referenceKeys) {
  if (!referenceKeys || referenceKeys.length === 0) {
    return rows;
  }

  return rows.map((row) => {
    const shaped = {};

    for (const key of referenceKeys) {
      shaped[key] = key in row ? row[key] : null;
    }

    return shaped;
  });
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(csvPath, 'utf8');
  const { rows } = parseCSV(csvText);
  const referenceKeys = getReferenceKeys(outputPath);
  const shapedRows = shapeRows(rows, referenceKeys);

  fs.writeFileSync(outputPath, `${JSON.stringify(shapedRows, null, 2)}\n`, 'utf8');

  console.log(`Generated ${shapedRows.length} records at ${outputPath}`);
}

main();
