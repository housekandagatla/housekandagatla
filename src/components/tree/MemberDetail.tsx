import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import type { FamilyMember } from '../../data/types';
import { getMemberPlacementLabel } from '../../utils/buildFamilyTree';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Icon } from '../ui/Icon';

type MemberDetailProps = {
  member: FamilyMember | null;
  onClose: () => void;
  onAddRelative: (memberId: string) => void;
  onEdit?: (member: FamilyMember) => void;
};

function formatDate(value?: string) {
  if (!value) {
    return '—';
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function MemberDetail({ member, onClose, onAddRelative, onEdit }: MemberDetailProps) {
  const { members, removeMember } = useFamily();
  const { isAdmin } = useAuth();

  const placementLabel = useMemo(
    () => (member ? getMemberPlacementLabel(member, members) : null),
    [member, members],
  );

  const handleDelete = async () => {
    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${member.fullName} from the family tree? Connected people will become family roots.`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await removeMember(member.id);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete member';
      window.alert(message);
    }
  };

  return (
    <Drawer
      open={Boolean(member)}
      onClose={onClose}
      title={member?.fullName ?? 'Family member'}
      eyebrow="FAMILY PROFILE"
      wide
      hideTitle
      className="kds-member-details-dialog"
    >
      {member ? (
        <>
          {isAdmin ? (
            <div className="kds-detail-icon-actions kds-detail-icon-actions-float">
              {onEdit ? (
                <button
                  type="button"
                  className="kds-detail-icon-button"
                  aria-label={`Edit ${member.fullName}`}
                  title="Edit"
                  onClick={() => onEdit(member)}
                >
                  <Icon name="edit" size={16} strokeWidth={1.8} />
                </button>
              ) : null}
              <button
                type="button"
                className="kds-detail-icon-button"
                aria-label={`Add relative of ${member.fullName}`}
                title="Add relative"
                onClick={() => onAddRelative(member.id)}
              >
                <Icon name="add" size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="kds-icon-danger"
                aria-label={`Delete ${member.fullName}`}
                title="Delete"
                onClick={handleDelete}
              >
                <Icon name="delete" size={16} strokeWidth={1.8} />
              </button>
            </div>
          ) : null}

          <div className="kds-member-details-heading">
            <span className="kds-member-avatar kds-member-avatar-lg">
              {member.fullName.charAt(0).toUpperCase()}
            </span>
            <div>
              <h2>{member.fullName}</h2>
              <p>{placementLabel}</p>
            </div>
          </div>

          <div className="kds-member-details-list">
            <div>
              <span>Relationship</span>
              <strong>{placementLabel || '—'}</strong>
            </div>
            <div>
              <span>Date of birth</span>
              <strong>{formatDate(member.dateOfBirth)}</strong>
            </div>
            <div>
              <span>Place</span>
              <strong>{member.place || '—'}</strong>
            </div>
            <div className="kds-member-details-about">
              <span>About</span>
              <strong>{member.about || 'No notes yet.'}</strong>
            </div>
          </div>

          <div className="kds-dialog-actions">
            <Button variant="secondary" type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      ) : null}
    </Drawer>
  );
}
