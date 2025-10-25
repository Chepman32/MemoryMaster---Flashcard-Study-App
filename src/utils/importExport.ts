import {Flashcard, Deck} from '../types';
import {initializeCard} from '../algorithms/spacedRepetition';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

/**
 * CSV Import/Export utilities
 */

export interface CSVRow {
  front: string;
  back: string;
  hint?: string;
  tags?: string;
}

export const parseCSV = (csvContent: string): CSVRow[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: CSVRow = {
      front: '',
      back: '',
    };

    headers.forEach((header, index) => {
      if (header === 'front') row.front = values[index] || '';
      else if (header === 'back') row.back = values[index] || '';
      else if (header === 'hint') row.hint = values[index];
      else if (header === 'tags') row.tags = values[index];
    });

    if (row.front && row.back) {
      rows.push(row);
    }
  }

  return rows;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

export const csvRowsToCards = (rows: CSVRow[], deckId: string): Flashcard[] => {
  return rows.map(row => {
    return initializeCard({
      deckId,
      front: row.front,
      back: row.back,
      hint: row.hint,
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
    });
  });
};

export const cardsToCSV = (cards: Flashcard[]): string => {
  const headers = ['Front', 'Back', 'Hint', 'Tags'];
  const rows = cards.map(card => {
    const front = escapeCSV(card.front);
    const back = escapeCSV(card.back);
    const hint = card.hint ? escapeCSV(card.hint) : '';
    const tags = card.tags ? card.tags.join(',') : '';
    return `${front},${back},${hint},${tags}`;
  });

  return [headers.join(','), ...rows].join('\n');
};

const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/**
 * JSON Import/Export
 */

export interface DeckExport {
  deck: Deck;
  cards: Flashcard[];
  exportDate: string;
  version: string;
}

export const exportDeckToJSON = (deck: Deck, cards: Flashcard[]): string => {
  const exportData: DeckExport = {
    deck,
    cards,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
};

export const importDeckFromJSON = (jsonContent: string): DeckExport => {
  try {
    const data = JSON.parse(jsonContent);

    if (!data.deck || !data.cards) {
      throw new Error('Invalid JSON format');
    }

    return data as DeckExport;
  } catch (error) {
    throw new Error('Failed to parse JSON file');
  }
};

/**
 * File operations
 */

export const saveFile = async (
  content: string,
  filename: string,
  mimeType: string,
): Promise<void> => {
  try {
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    await RNFS.writeFile(path, content, 'utf8');

    await Share.open({
      url: `file://${path}`,
      type: mimeType,
      filename,
    });
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

export const readFile = async (uri: string): Promise<string> => {
  try {
    const content = await RNFS.readFile(uri, 'utf8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

/**
 * Export deck to CSV
 */
export const exportDeckToCSV = async (deck: Deck, cards: Flashcard[]): Promise<void> => {
  const csv = cardsToCSV(cards);
  const filename = `${deck.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`;
  await saveFile(csv, filename, 'text/csv');
};

/**
 * Export deck to JSON
 */
export const exportDeckAsJSON = async (deck: Deck, cards: Flashcard[]): Promise<void> => {
  const json = exportDeckToJSON(deck, cards);
  const filename = `${deck.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
  await saveFile(json, filename, 'application/json');
};
