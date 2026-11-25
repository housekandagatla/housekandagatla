import { seedFestivals } from './seed';
import { STORAGE_KEY, type FamilyState } from './types';

const defaultState = (): FamilyState => ({
  members: [],
  festivals: seedFestivals,
});

export function loadFamilyState(): FamilyState {
  if (typeof window === 'undefined') {
    return defaultState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }

    const parsed = JSON.parse(raw) as Partial<FamilyState>;
    return {
      members: Array.isArray(parsed.members) ? parsed.members : [],
      festivals: Array.isArray(parsed.festivals) && parsed.festivals.length > 0
        ? parsed.festivals
        : seedFestivals,
    };
  } catch {
    return defaultState();
  }
}

export function saveFamilyState(state: FamilyState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
