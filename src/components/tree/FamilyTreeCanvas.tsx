import type { FamilyMember } from '../../data/types';
import { buildFamilyTree, type FamilyTreeNode } from '../../utils/buildFamilyTree';
import { Icon } from '../ui/Icon';

type FamilyTreeCanvasProps = {
  members: FamilyMember[];
  query?: string;
  onAdd: (connectToId?: string) => void;
  onSelect: (member: FamilyMember) => void;
  onDelete: (member: FamilyMember) => void;
};

function avatarTone(index: number) {
  const tones = ['', 'kds-avatar-clay', 'kds-avatar-blue', 'kds-avatar-gold'];
  return tones[index % tones.length];
}

function NodeCard({
  member,
  tone,
  muted,
  onAdd,
  onSelect,
  onDelete,
}: {
  member: FamilyMember;
  tone: string;
  muted?: boolean;
  onAdd: (connectToId?: string) => void;
  onSelect: (member: FamilyMember) => void;
  onDelete: (member: FamilyMember) => void;
}) {
  return (
    <article
      className={`kds-family-node-card transition-all duration-200 ease-out hover:-translate-y-0.5 ${
        muted ? 'kds-tree-node-muted' : ''
      }`}
    >
      <span className={`kds-member-avatar ${tone}`}>{member.fullName.charAt(0).toUpperCase()}</span>
      <div className="kds-family-node-copy">
        <strong>{member.fullName}</strong>
        <span>{member.isRoot ? 'Family root' : member.relationship || 'Family member'}</span>
        {member.about ? <p className="kds-family-node-bio">{member.about}</p> : null}
      </div>
      <div className="kds-family-node-actions">
        <button
          type="button"
          className="kds-node-edit-button transition-colors duration-150"
          aria-label={`View ${member.fullName}`}
          onClick={() => onSelect(member)}
        >
          <Icon name="visibility" size={14} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className="kds-node-add-button transition-colors duration-150"
          aria-label={`Add relative of ${member.fullName}`}
          onClick={() => onAdd(member.id)}
        >
          <Icon name="add" size={14} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="kds-node-delete-button transition-colors duration-150"
          aria-label={`Delete ${member.fullName}`}
          onClick={() => onDelete(member)}
        >
          <Icon name="delete" size={14} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}

function TreeBranch({
  node,
  toneIndex,
  query,
  onAdd,
  onSelect,
  onDelete,
}: {
  node: FamilyTreeNode;
  toneIndex: number;
  query: string;
  onAdd: (connectToId?: string) => void;
  onSelect: (member: FamilyMember) => void;
  onDelete: (member: FamilyMember) => void;
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

  return (
    <li className="kds-family-tree-branch">
      <div className={`kds-family-tree-couple${node.partner ? ' kds-has-partner' : ''}`}>
        <NodeCard
          member={node.member}
          tone={avatarTone(toneIndex)}
          muted={selfMuted}
          onAdd={onAdd}
          onSelect={onSelect}
          onDelete={onDelete}
        />
        {node.partner ? (
          <NodeCard
            member={node.partner}
            tone={avatarTone(toneIndex + 1)}
            muted={partnerMuted}
            onAdd={onAdd}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ) : null}
      </div>

      {node.children.length > 0 ? (
        <ul className="kds-family-tree-children">
          {node.children.map((child, index) => (
            <TreeBranch
              key={child.member.id}
              node={child}
              toneIndex={toneIndex + index + 2}
              query={query}
              onAdd={onAdd}
              onSelect={onSelect}
              onDelete={onDelete}
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
  onAdd,
  onSelect,
  onDelete,
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
              onAdd={onAdd}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
