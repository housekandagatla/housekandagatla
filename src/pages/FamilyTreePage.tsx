import { useMemo, useState } from 'react';
import { MemberForm } from '../components/forms/MemberForm';
import {
  FamilyTreeCanvas,
  type FamilyTreeLayout,
} from '../components/tree/FamilyTreeCanvas';
import { MemberDetail } from '../components/tree/MemberDetail';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { FamilyTreeSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import type { FamilyMember } from '../data/types';

export function FamilyTreePage() {
  const { members, loading } = useFamily();
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [layout, setLayout] = useState<FamilyTreeLayout>('tree');
  const [formOpen, setFormOpen] = useState(false);
  const [connectToId, setConnectToId] = useState<string | undefined>();
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [selected, setSelected] = useState<FamilyMember | null>(null);

  const filteredCount = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return members.length;
    }

    return members.filter((member) => {
      const haystack = [member.fullName, member.relationship, member.place, member.about]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    }).length;
  }, [members, query]);

  const openAddForm = (memberId?: string) => {
    if (!isAdmin) {
      return;
    }
    setEditingMember(null);
    setConnectToId(memberId);
    setSelected(null);
    setFormOpen(true);
  };

  const openEditForm = (member: FamilyMember) => {
    if (!isAdmin) {
      return;
    }
    setSelected(null);
    setConnectToId(undefined);
    setEditingMember(member);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setConnectToId(undefined);
    setEditingMember(null);
  };

  return (
    <section className="kds-page" aria-labelledby="tree-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>OUR PEOPLE</Eyebrow>
          <h1 id="tree-title">
            Family <em>tree</em>
          </h1>
          <p className="kds-welcome-subtitle">
            Every branch holds a name. Every name holds a story.
          </p>
        </div>
        {isAdmin ? (
          <Button className="kds-top-action" icon="add" onClick={() => openAddForm()}>
            Add family member
          </Button>
        ) : null}
      </div>

      {loading ? <FamilyTreeSkeleton /> : null}

      {!loading && members.length > 0 ? (
        <div className="kds-tree-toolbar">
          <label className="kds-search-field">
            <Icon name="search" size={17} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search names, relationships, places…"
              aria-label="Search family members"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="kds-tree-toolbar-end">
            <div className="kds-tree-layout-switch" role="group" aria-label="Tree layout">
              <button
                type="button"
                className={layout === 'tree' ? 'is-active' : undefined}
                aria-pressed={layout === 'tree'}
                onClick={() => setLayout('tree')}
              >
                Tree
              </button>
              <button
                type="button"
                className={layout === 'generations' ? 'is-active' : undefined}
                aria-pressed={layout === 'generations'}
                onClick={() => setLayout('generations')}
              >
                Generations
              </button>
            </div>
            <span className="kds-tree-count">
              <Icon name="people" size={15} strokeWidth={1.8} />
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>
      ) : null}

      {query.trim() && filteredCount !== members.length ? (
        <p className="kds-tree-search-message">
          Showing matches for “{query.trim()}” · dimmed cards are outside this search
        </p>
      ) : null}

      {!loading && members.length === 0 ? (
        <EmptyState
          kicker="ROOTS BEFORE BRANCHES"
          title={
            <>
              A family tree begins
              <br />
              with a single <em>name.</em>
            </>
          }
        />
      ) : null}

      {!loading && members.length > 0 ? (
        <FamilyTreeCanvas
          members={members}
          query={query}
          layout={layout}
          canEdit={isAdmin}
          onAdd={openAddForm}
          onSelect={setSelected}
        />
      ) : null}

      {isAdmin ? (
        <MemberForm
          open={formOpen}
          connectToId={connectToId}
          member={editingMember}
          onClose={closeForm}
        />
      ) : null}

      <MemberDetail
        member={selected}
        onClose={() => setSelected(null)}
        onAddRelative={(memberId) => openAddForm(memberId)}
        onEdit={openEditForm}
      />
    </section>
  );
}
