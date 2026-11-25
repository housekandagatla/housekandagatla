import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  deleteAllMemberDocs,
  deleteFestivalDoc,
  deleteMemberDoc,
  ensureSeedData,
  saveHeritage,
  saveStory,
  subscribeFestivals,
  subscribeHeritage,
  subscribeMembers,
  subscribeStory,
  upsertFestival,
  upsertMember,
} from '../data/firestore';
import { createId } from '../data/ids';
import { familyDeity, heritageItems } from '../data/seed';
import {
  isAscendantRelationship,
  type FamilyMember,
  type FamilyStory,
  type Festival,
  type HeritageData,
  type Relationship,
} from '../data/types';
import { isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from './AuthContext';

function childRoleAfterAddingParent(
  parentRelationship?: Relationship,
  existing?: Relationship,
): Relationship {
  if (parentRelationship === 'Grandparent') {
    return 'Grandchild';
  }
  if (existing === 'Son' || existing === 'Daughter') {
    return existing;
  }
  return 'Son';
}

function inheritLinkToGrandparent(existing?: Relationship): Relationship {
  if (existing === 'Son' || existing === 'Daughter' || existing === 'Grandchild') {
    return existing;
  }
  return 'Son';
}

export interface MemberInput {
  fullName: string;
  isRoot: boolean;
  connectedToId?: string;
  relationship?: Relationship;
  dateOfBirth?: string;
  about?: string;
  place?: string;
}

export interface FestivalInput {
  title: string;
  description: string;
  category?: string;
  dateLabel?: string;
}

interface FamilyContextValue {
  members: FamilyMember[];
  festivals: Festival[];
  heritage: HeritageData;
  story: FamilyStory;
  loading: boolean;
  error: string | null;
  addMember: (input: MemberInput) => Promise<void>;
  updateMember: (id: string, input: MemberInput) => Promise<void>;
  addFestival: (input: FestivalInput) => Promise<void>;
  updateFestival: (id: string, input: FestivalInput) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  clearFamilyTree: () => Promise<void>;
  removeFestival: (id: string) => Promise<void>;
  updateHeritage: (heritage: HeritageData) => Promise<void>;
  updateStory: (story: Pick<FamilyStory, 'title' | 'body'>) => Promise<void>;
}

const defaultStory: FamilyStory = {
  title: 'Our family story',
  body: '',
  updatedAt: '',
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [heritage, setHeritage] = useState<HeritageData>({
    items: heritageItems,
    deity: familyDeity,
  });
  const [story, setStory] = useState<FamilyStory>(defaultStory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seedAttempted, setSeedAttempted] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Add VITE_FIREBASE_* values to .env');
      setLoading(false);
      return;
    }

    const ready = new Set<string>();
    const markReady = (key: string) => {
      ready.add(key);
      if (ready.size >= 4) {
        setLoading(false);
      }
    };

    const handleError = (key: string) => (err: Error) => {
      setError(err.message);
      markReady(key);
    };

    const unsubs = [
      subscribeMembers((next) => {
        setMembers(next);
        markReady('members');
      }, handleError('members')),
      subscribeFestivals((next) => {
        setFestivals(next);
        markReady('festivals');
      }, handleError('festivals')),
      subscribeHeritage((next) => {
        setHeritage(next);
        markReady('heritage');
      }, handleError('heritage')),
      subscribeStory((next) => {
        setStory(next);
        markReady('story');
      }, handleError('story')),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  useEffect(() => {
    if (!isAdmin || seedAttempted || !isFirebaseConfigured || loading) {
      return;
    }

    setSeedAttempted(true);
    ensureSeedData().catch((err: Error) => {
      console.warn('Seed skipped or failed:', err.message);
    });
  }, [isAdmin, seedAttempted, loading]);

  const addMember = useCallback(
    async (input: MemberInput) => {
      const anchor =
        !input.isRoot && input.connectedToId
          ? members.find((member) => member.id === input.connectedToId)
          : undefined;

      // Father / Mother / Grandparent: create above the connected person and re-link them.
      if (anchor && isAscendantRelationship(input.relationship)) {
        const parentId = createId('member');
        const wasRoot = anchor.isRoot || !anchor.connectedToId;
        const parent: FamilyMember = {
          id: parentId,
          fullName: input.fullName.trim(),
          isRoot: wasRoot,
          connectedToId: wasRoot ? undefined : anchor.connectedToId,
          relationship: wasRoot ? undefined : inheritLinkToGrandparent(anchor.relationship),
          dateOfBirth: input.dateOfBirth?.trim() || undefined,
          about: input.about?.trim() || undefined,
          place: input.place?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };

        await upsertMember(parent);
        await upsertMember({
          ...anchor,
          isRoot: false,
          connectedToId: parentId,
          relationship: childRoleAfterAddingParent(input.relationship, anchor.relationship),
        });
        return;
      }

      const member: FamilyMember = {
        id: createId('member'),
        fullName: input.fullName.trim(),
        isRoot: input.isRoot,
        connectedToId: input.isRoot ? undefined : input.connectedToId,
        relationship: input.isRoot ? undefined : input.relationship,
        dateOfBirth: input.dateOfBirth?.trim() || undefined,
        about: input.about?.trim() || undefined,
        place: input.place?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      await upsertMember(member);
    },
    [members],
  );

  const updateMember = useCallback(
    async (id: string, input: MemberInput) => {
      const existing = members.find((member) => member.id === id);
      if (!existing) {
        throw new Error('Family member not found.');
      }

      const isRoot = input.isRoot || members.length <= 1;
      const anchor =
        !isRoot && input.connectedToId
          ? members.find((member) => member.id === input.connectedToId)
          : undefined;

      if (anchor && anchor.id !== id && isAscendantRelationship(input.relationship)) {
        const wasRoot = anchor.isRoot || !anchor.connectedToId;
        await upsertMember({
          ...existing,
          fullName: input.fullName.trim(),
          isRoot: wasRoot,
          connectedToId: wasRoot ? undefined : anchor.connectedToId,
          relationship: wasRoot ? undefined : inheritLinkToGrandparent(anchor.relationship),
          dateOfBirth: input.dateOfBirth?.trim() || undefined,
          about: input.about?.trim() || undefined,
          place: input.place?.trim() || undefined,
        });
        await upsertMember({
          ...anchor,
          isRoot: false,
          connectedToId: id,
          relationship: childRoleAfterAddingParent(input.relationship, anchor.relationship),
        });
        return;
      }

      await upsertMember({
        ...existing,
        fullName: input.fullName.trim(),
        isRoot,
        connectedToId: isRoot ? undefined : input.connectedToId,
        relationship: isRoot ? undefined : input.relationship,
        dateOfBirth: input.dateOfBirth?.trim() || undefined,
        about: input.about?.trim() || undefined,
        place: input.place?.trim() || undefined,
      });
    },
    [members],
  );

  const addFestival = useCallback(async (input: FestivalInput) => {
    const festival: Festival = {
      id: createId('fest'),
      title: input.title.trim(),
      category: input.category?.trim() || 'Family tradition',
      description: input.description.trim(),
      dateLabel: input.dateLabel?.trim() || '—',
      createdAt: new Date().toISOString(),
    };

    await upsertFestival(festival);
  }, []);

  const updateFestival = useCallback(
    async (id: string, input: FestivalInput) => {
      const existing = festivals.find((festival) => festival.id === id);
      if (!existing) {
        throw new Error('Festival not found.');
      }

      await upsertFestival({
        ...existing,
        title: input.title.trim(),
        category: input.category?.trim() || existing.category || 'Family tradition',
        description: input.description.trim(),
        dateLabel: input.dateLabel?.trim() || existing.dateLabel || '—',
      });
    },
    [festivals],
  );

  const removeMember = useCallback(
    async (id: string) => {
      const connected = members.filter((member) => member.connectedToId === id);
      await deleteMemberDoc(id);
      await Promise.all(
        connected.map((member) =>
          upsertMember({
            ...member,
            connectedToId: undefined,
            isRoot: true,
            relationship: undefined,
          }),
        ),
      );
    },
    [members],
  );

  const clearFamilyTree = useCallback(async () => {
    await deleteAllMemberDocs();
  }, []);

  const removeFestival = useCallback(async (id: string) => {
    await deleteFestivalDoc(id);
  }, []);

  const updateHeritage = useCallback(async (next: HeritageData) => {
    await saveHeritage(next);
  }, []);

  const updateStory = useCallback(async (next: Pick<FamilyStory, 'title' | 'body'>) => {
    await saveStory({
      title: next.title.trim() || 'Our family story',
      body: next.body.trim(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const value = useMemo(
    () => ({
      members,
      festivals,
      heritage,
      story,
      loading,
      error,
      addMember,
      updateMember,
      addFestival,
      updateFestival,
      removeMember,
      clearFamilyTree,
      removeFestival,
      updateHeritage,
      updateStory,
    }),
    [
      members,
      festivals,
      heritage,
      story,
      loading,
      error,
      addMember,
      updateMember,
      addFestival,
      updateFestival,
      removeMember,
      clearFamilyTree,
      removeFestival,
      updateHeritage,
      updateStory,
    ],
  );

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }

  return context;
}
