import type { FamilyMember } from '../../data/types';
import {
  buildFamilyGenerations,
  buildFamilyTree,
  type FamilyTreeNode,
} from '../../utils/buildFamilyTree';
import { Icon } from '../ui/Icon';

export type FamilyTreeLayout = 'tree' | 'generations';

type FamilyTreeCanvasProps = {
  members: FamilyMember[];
  query?: string;
  layout?: FamilyTreeLayout;
  canEdit?: boolean;
  onAdd: (connectToId?: string) => void;
  onSelect: (member: FamilyMember) => void;
};

function avatarTone(index: number) {
  const tones = ['', 'kds-avatar-clay', 'kds-avatar-blue', 'kds-avatar-gold'];
  return tones[index % tones.length];
}

function NodeCard({
  member,
  tone,
  muted,
  canEdit,
  parentsLabel,
  onAdd,
  onSelect,
}: {
  member: FamilyMember;
  tone: string;
  muted?: boolean;
  canEdit?: boolean;
  parentsLabel?: string;
  onAdd: (connectToId?: string) => void;
  onSelect: (member: FamilyMember) => void;
}) {
  const relation = member.isRoot
    ? 'Family root'
    : member.relationship || 'Family member';

  return (
    <article
      className={`kds-family-node-card${muted ? ' kds-tree-node-muted' : ''}`}
    >
      <span className={`kds-member-avatar ${tone}`} aria-hidden="true">
        {member.fullName.charAt(0).toUpperCase()}
      </span>
      <div className="kds-family-node-copy">
        <strong>{member.fullName}</strong>
        <span className="kds-family-node-meta">
          {relation}
          {parentsLabel ? ` · ${parentsLabel}` : ''}
        </span>
      </div>
      <div className="kds-family-node-actions">
        <button
          type="button"
          className="kds-node-view-button"
          aria-label={`View ${member.fullName}`}
          onClick={() => onSelect(member)}
        >
          <Icon name="view" size={10} strokeWidth={1.8} />
        </button>
        {canEdit ? (
          <button
            type="button"
            className="kds-node-add-button"
            aria-label={`Add relative of ${member.fullName}`}
            onClick={() => onAdd(member.id)}
          >
            <Icon name="add" size={8} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
    </article>
  );
}

function matchesQuery(member: FamilyMember, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return [member.fullName, member.relationship, member.place, member.about]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(needle);
}

function TreeBranch({
  node,
  toneIndex,
  query,
  canEdit,
  parentsLabel,
  onAdd,
  onSelect,
}: {
  node: FamilyTreeNode;
  toneIndex: number;
  query: string;
  canEdit?: boolean;
  parentsLabel?: string;
  onAdd: (connectToId?: string) => void;
  onSelect: (member: FamilyMember) => void;
}) {
  const selfMuted = !matchesQuery(node.member, query);
  const partnerMuted = node.partner ? !matchesQuery(node.partner, query) : false;
  const hasChildren = node.children.length > 0;
  const asParentsLabel = node.partner
    ? `${node.member.fullName} & ${node.partner.fullName}`
    : node.member.fullName;

  return (
    <li className="kds-family-tree-branch">
      <div
        className={`kds-family-tree-couple${node.partner ? ' kds-has-partner' : ''}${
          hasChildren ? ' kds-has-children' : ''
        }`}
      >
        <NodeCard
          member={node.member}
          tone={avatarTone(toneIndex)}
          muted={selfMuted}
          canEdit={canEdit}
          parentsLabel={parentsLabel}
          onAdd={onAdd}
          onSelect={onSelect}
        />
        {node.partner ? (
          <NodeCard
            member={node.partner}
            tone={avatarTone(toneIndex + 1)}
            muted={partnerMuted}
            canEdit={canEdit}
            onAdd={onAdd}
            onSelect={onSelect}
          />
        ) : null}
      </div>

      {hasChildren ? (
        <ul className="kds-family-tree-children">
          {node.children.map((child, index) => (
            <TreeBranch
              key={child.member.id}
              node={child}
              toneIndex={toneIndex + index + 2}
              query={query}
              canEdit={canEdit}
              parentsLabel={asParentsLabel}
              onAdd={onAdd}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function TreeLayout({
  members,
  query,
  canEdit,
  onAdd,
  onSelect,
}: Omit<FamilyTreeCanvasProps, 'layout'>) {
  const tree = buildFamilyTree(members);

  if (tree.length === 0) {
    return <p className="kds-mini-tree-empty">Add people to grow the Kandagatla family tree.</p>;
  }

  return (
    <ul className="kds-family-tree-roots">
      {tree.map((node, index) => (
        <TreeBranch
          key={node.member.id}
          node={node}
          toneIndex={index}
          query={query ?? ''}
          canEdit={canEdit}
          onAdd={onAdd}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function GenerationsLayout({
  members,
  query,
  canEdit,
  onAdd,
  onSelect,
}: Omit<FamilyTreeCanvasProps, 'layout'>) {
  const generations = buildFamilyGenerations(members);

  if (generations.length === 0) {
    return <p className="kds-mini-tree-empty">Add people to grow the Kandagatla family tree.</p>;
  }

  let tone = 0;

  return (
    <div className="kds-family-generations">
      {generations.map((generation) => (
        <section key={generation.level} className="kds-family-generation">
          <header className="kds-family-generation-header">
            <h3>{generation.label}</h3>
            <span>
              {generation.units.length}{' '}
              {generation.units.length === 1 ? 'branch' : 'branches'}
            </span>
          </header>
          <div className="kds-family-generation-row">
            {generation.units.map((unit) => {
              const memberTone = tone++;
              const partnerTone = unit.partner ? tone++ : memberTone;
              return (
                <div
                  key={unit.member.id}
                  className={`kds-family-generation-unit${
                    unit.partner ? ' kds-has-partner' : ''
                  }`}
                >
                  <NodeCard
                    member={unit.member}
                    tone={avatarTone(memberTone)}
                    muted={!matchesQuery(unit.member, query ?? '')}
                    canEdit={canEdit}
                    parentsLabel={unit.parentsLabel}
                    onAdd={onAdd}
                    onSelect={onSelect}
                  />
                  {unit.partner ? (
                    <NodeCard
                      member={unit.partner}
                      tone={avatarTone(partnerTone)}
                      muted={!matchesQuery(unit.partner, query ?? '')}
                      canEdit={canEdit}
                      onAdd={onAdd}
                      onSelect={onSelect}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FamilyTreeCanvas({
  members,
  query = '',
  layout = 'tree',
  canEdit = false,
  onAdd,
  onSelect,
}: FamilyTreeCanvasProps) {
  return (
    <div className={`kds-family-tree-canvas kds-layout-${layout}`}>
      <div className="kds-family-tree-caption">
        <span>{layout === 'tree' ? 'Branching tree' : 'By generation'}</span>
        <span>
          {layout === 'tree' ? 'Scroll to explore branches' : 'Roots at the top, descendants below'}
        </span>
      </div>

      {layout === 'generations' ? (
        <GenerationsLayout
          members={members}
          query={query}
          canEdit={canEdit}
          onAdd={onAdd}
          onSelect={onSelect}
        />
      ) : (
        <TreeLayout
          members={members}
          query={query}
          canEdit={canEdit}
          onAdd={onAdd}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
