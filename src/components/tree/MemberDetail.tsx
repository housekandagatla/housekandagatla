import { useFamily } from '../../context/FamilyContext';
import type { FamilyMember } from '../../data/types';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';

type MemberDetailProps = {
  member: FamilyMember | null;
  onClose: () => void;
  onAddRelative: (memberId: string) => void;
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

export function MemberDetail({ member, onClose, onAddRelative }: MemberDetailProps) {
  const { removeMember } = useFamily();

  const handleDelete = () => {
    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${member.fullName} from the family tree? Connected people will become family roots.`,
    );
    if (!confirmed) {
      return;
    }

    removeMember(member.id);
    onClose();
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
          <div className="kds-member-details-heading">
            <span className="kds-member-avatar kds-member-avatar-lg">
              {member.fullName.charAt(0).toUpperCase()}
            </span>
            <div>
              <h2>{member.fullName}</h2>
              <p>{member.isRoot ? 'Family root' : member.relationship || 'Family member'}</p>
            </div>
          </div>

          <div className="kds-member-details-list">
            <div>
              <span>Relationship</span>
              <strong>{member.isRoot ? 'Family root' : member.relationship || '—'}</strong>
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

          <div className="kds-dialog-actions kds-dialog-actions-split">
            <button type="button" className="kds-text-danger" onClick={handleDelete}>
              Delete member
            </button>
            <div className="kds-dialog-actions-end">
              <Button variant="secondary" type="button" onClick={onClose}>
                Close
              </Button>
              <Button
                icon="add"
                type="button"
                onClick={() => {
                  onAddRelative(member.id);
                }}
              >
                Add relative
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </Drawer>
  );
}
