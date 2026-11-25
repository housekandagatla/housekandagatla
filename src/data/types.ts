export type Relationship =
  | 'Family member'
  | 'Father'
  | 'Mother'
  | 'Husband'
  | 'Wife'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister'
  | 'Grandparent'
  | 'Grandchild'
  | 'Cousin'
  | 'Other relative';

export interface FamilyMember {
  id: string;
  fullName: string;
  isRoot: boolean;
  connectedToId?: string;
  relationship?: Relationship;
  dateOfBirth?: string;
  about?: string;
  place?: string;
  createdAt: string;
}

export interface Festival {
  id: string;
  title: string;
  category: string;
  description: string;
  dateLabel?: string;
  createdAt: string;
}

export interface HeritageItem {
  index?: string;
  label: string;
  telugu: string;
  english: string;
}

export interface FamilyState {
  members: FamilyMember[];
  festivals: Festival[];
}

export const RELATIONSHIPS: Relationship[] = [
  'Family member',
  'Father',
  'Mother',
  'Husband',
  'Wife',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Grandparent',
  'Grandchild',
  'Cousin',
  'Other relative',
];

export const STORAGE_KEY = 'hok-family-data-v1';
