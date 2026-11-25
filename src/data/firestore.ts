import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { familyDeity, heritageItems, seedFestivals } from './seed';
import type {
  FamilyMember,
  FamilyStory,
  Festival,
  HeritageData,
} from './types';
import { ADMIN_EMAIL, db } from '../lib/firebase';

function requireDb() {
  if (!db) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* env values.');
  }
  return db;
}

function membersCol() {
  return collection(requireDb(), 'families', 'hok', 'members');
}

function festivalsCol() {
  return collection(requireDb(), 'families', 'hok', 'festivals');
}

function metaDoc(name: string) {
  return doc(requireDb(), 'families', 'hok', 'meta', name);
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export function subscribeMembers(
  onData: (members: FamilyMember[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    membersCol(),
    (snapshot) => {
      const members = snapshot.docs.map((item) => {
        const data = item.data() as Omit<FamilyMember, 'id'>;
        return { ...data, id: item.id } as FamilyMember;
      });
      members.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      onData(members);
    },
    (error) => onError?.(error),
  );
}

export function subscribeFestivals(
  onData: (festivals: Festival[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    festivalsCol(),
    (snapshot) => {
      const festivals = snapshot.docs.map((item) => {
        const data = item.data() as Omit<Festival, 'id'>;
        return { ...data, id: item.id } as Festival;
      });
      festivals.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      onData(festivals);
    },
    (error) => onError?.(error),
  );
}

export function subscribeHeritage(
  onData: (heritage: HeritageData) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    metaDoc('heritage'),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData({ items: heritageItems, deity: familyDeity });
        return;
      }
      const data = snapshot.data() as HeritageData;
      const items = Array.isArray(data.items) ? data.items : heritageItems;
      onData({
        items: items.map((item, index) => {
          const seed = heritageItems[index];
          const legacyLabel =
            typeof item.label === 'string' && /^Our\s/i.test(item.label) && seed?.label
              ? seed.label
              : item.label;
          const legacyEnglish =
            seed?.english && typeof item.english === 'string' && item.english.includes(' · ')
              ? seed.english
              : item.english;
          return {
            ...item,
            label: legacyLabel,
            teluguLabel: item.teluguLabel || seed?.teluguLabel,
            english: legacyEnglish,
          };
        }),
        deity: (() => {
          const deity = data.deity ?? familyDeity;
          const english =
            familyDeity.english &&
            typeof deity.english === 'string' &&
            deity.english.includes(' · ')
              ? familyDeity.english
              : deity.english;
          const label =
            typeof deity.label === 'string' && /^Our\s/i.test(deity.label)
              ? familyDeity.label
              : deity.label;
          return {
            ...deity,
            label,
            teluguLabel: deity.teluguLabel || familyDeity.teluguLabel,
            english,
          };
        })(),
      });
    },
    (error) => onError?.(error),
  );
}

export function subscribeStory(
  onData: (story: FamilyStory) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    metaDoc('story'),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData({
          title: 'Our family story',
          body: '',
          updatedAt: '',
        });
        return;
      }
      const data = snapshot.data() as FamilyStory;
      onData({
        title: data.title || 'Our family story',
        body: data.body || '',
        updatedAt: data.updatedAt || '',
      });
    },
    (error) => onError?.(error),
  );
}

async function withWriteError<T>(action: () => Promise<T>, label: string): Promise<T> {
  try {
    return await action();
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String((error as { code?: string }).code)
        : '';
    if (code === 'permission-denied') {
      throw new Error(
        `${label} was blocked by Firebase rules. Sign in as ${ADMIN_EMAIL} and confirm Firestore rules allow admin writes.`,
      );
    }
    throw error instanceof Error ? error : new Error(`${label} failed.`);
  }
}

export async function upsertMember(member: FamilyMember): Promise<void> {
  const { id, ...rest } = member;
  await withWriteError(
    () => setDoc(doc(membersCol(), id), stripUndefined({ ...rest })),
    'Saving member',
  );
}

export async function deleteMemberDoc(id: string): Promise<void> {
  await withWriteError(() => deleteDoc(doc(membersCol(), id)), 'Deleting member');
}

export async function upsertFestival(festival: Festival): Promise<void> {
  const { id, ...rest } = festival;
  await withWriteError(
    () => setDoc(doc(festivalsCol(), id), stripUndefined({ ...rest })),
    'Saving festival',
  );
}

export async function deleteFestivalDoc(id: string): Promise<void> {
  await withWriteError(() => deleteDoc(doc(festivalsCol(), id)), 'Deleting festival');
}

export async function saveHeritage(heritage: HeritageData): Promise<void> {
  await withWriteError(() => setDoc(metaDoc('heritage'), heritage), 'Saving heritage');
}

export async function saveStory(story: FamilyStory): Promise<void> {
  await withWriteError(() => setDoc(metaDoc('story'), story), 'Saving story');
}

/** One-time seed of festivals / heritage / story / admins when missing. Requires admin write access. */
export async function ensureSeedData(): Promise<void> {
  const database = requireDb();
  const [festivalsSnap, heritageSnap, storySnap, adminsSnap, bootstrapSnap] = await Promise.all([
    getDocs(festivalsCol()),
    getDoc(metaDoc('heritage')),
    getDoc(metaDoc('story')),
    getDoc(metaDoc('admins')),
    getDoc(metaDoc('bootstrap')),
  ]);

  // Never re-seed after the project has been initialized; deleting all festivals must stay deleted.
  if (bootstrapSnap.exists() || adminsSnap.exists()) {
    return;
  }

  const batch = writeBatch(database);
  let writes = 0;

  if (festivalsSnap.empty) {
    for (const festival of seedFestivals) {
      const { id, ...rest } = festival;
      batch.set(doc(festivalsCol(), id), rest);
      writes += 1;
    }
  }

  if (!heritageSnap.exists()) {
    batch.set(metaDoc('heritage'), { items: heritageItems, deity: familyDeity });
    writes += 1;
  }

  if (!storySnap.exists()) {
    batch.set(metaDoc('story'), {
      title: 'Our family story',
      body: '',
      updatedAt: new Date().toISOString(),
    });
    writes += 1;
  }

  batch.set(metaDoc('admins'), { emails: ['thehouseofkandagatla@gmail.com'] });
  batch.set(metaDoc('bootstrap'), {
    completedAt: new Date().toISOString(),
  });
  writes += 2;

  if (writes > 0) {
    await batch.commit();
  }
}
