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
  /** English category sense shown with Telugu label (e.g. Community). */
  label: string;
  /** Short Telugu category label (e.g. కులం). */
  teluguLabel?: string;
  /** Telugu value (e.g. పద్మశాలి). */
  telugu: string;
  /** English / Latin value from the database (e.g. Padmasali). */
  english: string;
}

export interface FamilyDeity {
  /** English category sense (e.g. Family deity). */
  label: string;
  /** Telugu category label (e.g. కుల దైవం). */
  teluguLabel?: string;
  telugu: string;
  /** English / Latin value from the database. */
  english: string;
}

export interface HeritageData {
  items: HeritageItem[];
  deity: FamilyDeity;
}

export interface FamilyStory {
  title: string;
  body: string;
  updatedAt: string;
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

const ASCENDANT_RELATIONSHIPS = new Set<Relationship>(['Father', 'Mother', 'Grandparent']);

/** Father / Mother / Grandparent — place above the connected person in the tree. */
export function isAscendantRelationship(relationship?: Relationship | string) {
  return Boolean(relationship && ASCENDANT_RELATIONSHIPS.has(relationship as Relationship));
}
