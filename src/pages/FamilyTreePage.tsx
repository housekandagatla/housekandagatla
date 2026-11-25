import { useMemo, useState } from 'react';
import { MemberForm } from '../components/forms/MemberForm';
import { FamilyTreeCanvas } from '../components/tree/FamilyTreeCanvas';
import { MemberDetail } from '../components/tree/MemberDetail';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { useFamily } from '../context/FamilyContext';
import type { FamilyMember } from '../data/types';

export function FamilyTreePage() {
  const { members, removeMember } = useFamily();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [connectToId, setConnectToId] = useState<string | undefined>();
  const [selected, setSelected] = useState<FamilyMember | null>(null);

  const handleDelete = (member: FamilyMember) => {
    const confirmed = window.confirm(
      `Delete ${member.fullName} from the family tree? People connected to them will become family roots.`,
    );
    if (!confirmed) {
      return;
    }

    removeMember(member.id);
    setSelected((current) => (current?.id === member.id ? null : current));
  };

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

  const openForm = (memberId?: string) => {
    setConnectToId(memberId);
    setSelected(null);
    setFormOpen(true);
  };

  return (
    <section className="kds-page" aria-labelledby="tree-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>OUR PEOPLE</Eyebrow>
          <h1 id="tree-title">
            The family <em>tree</em>
          </h1>
          <p className="kds-welcome-subtitle">
            Every branch holds a name. Every name holds a story.
          </p>
        </div>
        <Button className="kds-top-action" icon="add" onClick={() => openForm()}>
          Add family member
        </Button>
      </div>

      <div className="kds-search-bar">
        <label className="kds-search-field">
          <Icon name="search" size={16} strokeWidth={1.8} />
          <input
            type="search"
            placeholder="Search names, relationships, places…"
            aria-label="Search family members"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <span className="kds-member-count">
          <Icon name="people" size={16} strokeWidth={1.8} />
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </span>
      </div>

      {query.trim() && filteredCount !== members.length ? (
        <p className="kds-tree-search-message">
          Showing matches for “{query.trim()}” · dimmed cards are outside this search
        </p>
      ) : null}

      {members.length === 0 ? (
        <EmptyState
          kicker="ROOTS BEFORE BRANCHES"
          title={
            <>
              A family tree begins
              <br />
              with a single <em>name.</em>
            </>
          }
          description="Add the first person to begin gathering your family story. Grow the tree one generation, one memory, one name at a time."
          footnote="KANDAGATLA FAMILY · CONNECTED THROUGH GENERATIONS"
          action={
            <Button icon="add" onClick={() => openForm()}>
              Add the first family member
            </Button>
          }
        />
      ) : (
        <FamilyTreeCanvas
          members={members}
          query={query}
          onAdd={openForm}
          onSelect={setSelected}
          onDelete={handleDelete}
        />
      )}

      <MemberForm
        open={formOpen}
        connectToId={connectToId}
        onClose={() => {
          setFormOpen(false);
          setConnectToId(undefined);
        }}
      />

      <MemberDetail
        member={selected}
        onClose={() => setSelected(null)}
        onAddRelative={(memberId) => openForm(memberId)}
      />
    </section>
  );
}
