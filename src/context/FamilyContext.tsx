import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createId, loadFamilyState, saveFamilyState } from '../data/storage';
import type { FamilyMember, Festival, Relationship } from '../data/types';

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
  category: string;
  description: string;
  dateLabel?: string;
}

interface FamilyContextValue {
  members: FamilyMember[];
  festivals: Festival[];
  addMember: (input: MemberInput) => void;
  addFestival: (input: FestivalInput) => void;
  removeMember: (id: string) => void;
  removeFestival: (id: string) => void;
}

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const state = loadFamilyState();
    setMembers(state.members);
    setFestivals(state.festivals);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    saveFamilyState({ members, festivals });
  }, [members, festivals, ready]);

  const addMember = useCallback((input: MemberInput) => {
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

    setMembers((current) => [...current, member]);
  }, []);

  const addFestival = useCallback((input: FestivalInput) => {
    const festival: Festival = {
      id: createId('fest'),
      title: input.title.trim(),
      category: input.category.trim() || 'Family tradition',
      description: input.description.trim(),
      dateLabel: input.dateLabel?.trim() || '—',
      createdAt: new Date().toISOString(),
    };

    setFestivals((current) => [...current, festival]);
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers((current) =>
      current
        .filter((member) => member.id !== id)
        .map((member) =>
          member.connectedToId === id
            ? {
                ...member,
                connectedToId: undefined,
                isRoot: true,
                relationship: undefined,
              }
            : member,
        ),
    );
  }, []);

  const removeFestival = useCallback((id: string) => {
    setFestivals((current) => current.filter((festival) => festival.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      members,
      festivals,
      addMember,
      addFestival,
      removeMember,
      removeFestival,
    }),
    [members, festivals, addMember, addFestival, removeMember, removeFestival],
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
