import type { FamilyMember } from '../../data/types';
import { buildFamilyTree, type FamilyTreeNode } from '../../utils/buildFamilyTree';
import { Icon } from '../ui/Icon';

type FamilyTreeCanvasProps = {
  members: FamilyMember[];
  query?: string;
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
          className="kds-node-edit-button"
          aria-label={`View ${member.fullName}`}
          onClick={() => onSelect(member)}
        >
          <Icon name="edit" size={12} strokeWidth={1.8} />
        </button>
        {canEdit ? (
          <button
            type="button"
            className="kds-node-add-button"
            aria-label={`Add relative of ${member.fullName}`}
            onClick={() => onAdd(member.id)}
          >
            <Icon name="add" size={12} strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </article>
  );
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
  const needle = query.trim().toLowerCase();
  const matches = (member: FamilyMember) => {
    if (!needle) {
      return true;
    }
    return [member.fullName, member.relationship, member.place, member.about]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(needle);
  };

  const selfMuted = !matches(node.member);
  const partnerMuted = node.partner ? !matches(node.partner) : false;
  const hasChildren = node.children.length > 0;
  const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;
  const asParentsLabel = node.partner
    ? `${firstName(node.member.fullName)} & ${firstName(node.partner.fullName)}`
    : firstName(node.member.fullName);

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
        {hasChildren ? <span className="kds-family-tree-couple-stem" aria-hidden="true" /> : null}
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

export function FamilyTreeCanvas({
  members,
  query = '',
  canEdit = false,
  onAdd,
  onSelect,
}: FamilyTreeCanvasProps) {
  const tree = buildFamilyTree(members);

  return (
    <div className="kds-family-tree-canvas">
      <div className="kds-family-tree-caption">
        <span>Family structure</span>
        <span>Scroll to explore branches</span>
      </div>

      {tree.length === 0 ? (
        <p className="kds-mini-tree-empty">Add people to grow the Kandagatla family tree.</p>
      ) : (
        <ul className="kds-family-tree-roots">
          {tree.map((node, index) => (
            <TreeBranch
              key={node.member.id}
              node={node}
              toneIndex={index}
              query={query}
              canEdit={canEdit}
              onAdd={onAdd}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
