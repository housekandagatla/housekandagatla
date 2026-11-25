import type { Festival, HeritageItem } from './types';

export const seedFestivals: Festival[] = [
  {
    id: 'fest-vinayaka',
    title: 'Vinayaka Chavithi',
    category: 'Family tradition',
    description: 'Prayer, modaks, and time together with family.',
    dateLabel: '—',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'fest-diwali',
    title: 'Diwali',
    category: 'Festival of lights',
    description: 'An evening of lights, sweets, and family time.',
    dateLabel: '—',
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'fest-yellamma',
    title: 'Yellamma Panduga',
    category: 'Family tradition',
    description: 'A cherished tradition shared across generations.',
    dateLabel: '—',
    createdAt: '2024-01-03T00:00:00.000Z',
  },
  {
    id: 'fest-maisamma',
    title: 'Maisamma Jatara',
    category: 'Family gathering',
    description: 'A time to come together and honor Maisamma.',
    dateLabel: '—',
    createdAt: '2024-01-04T00:00:00.000Z',
  },
];

export const heritageItems: HeritageItem[] = [
  {
    index: '01',
    label: 'Community',
    teluguLabel: 'కులం',
    telugu: 'పద్మశాలి',
    english: 'Padmasali',
  },
  {
    index: '02',
    label: 'Family name',
    teluguLabel: 'ఇంటి పేరు',
    telugu: 'కందగట్ల',
    english: 'Kandagatla',
  },
  {
    index: '03',
    label: 'Ancestral lineage',
    teluguLabel: 'గోత్రం',
    telugu: 'విదురిషి',
    english: 'Vidurishi',
  },
];

export const familyDeity = {
  label: 'Family deity',
  teluguLabel: 'కుల దైవం',
  telugu: 'లక్ష్మీ నరసింహ స్వామి',
  english: 'Lakshmi Narasimha Swamy',
};
