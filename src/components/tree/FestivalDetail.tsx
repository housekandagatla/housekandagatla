import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import type { Festival } from '../../data/types';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Icon } from '../ui/Icon';

type FestivalDetailProps = {
  festival: Festival | null;
  onClose: () => void;
  onEdit?: (festival: Festival) => void;
};

export function FestivalDetail({ festival, onClose, onEdit }: FestivalDetailProps) {
  const { removeFestival } = useFamily();
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    if (!festival) {
      return;
    }

    const confirmed = window.confirm(`Remove “${festival.title}” from family festivals?`);
    if (!confirmed) {
      return;
    }

    try {
      await removeFestival(festival.id);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete festival';
      window.alert(message);
    }
  };

  return (
    <Drawer
      open={Boolean(festival)}
      onClose={onClose}
      title={festival?.title ?? 'Festival'}
      subtitle="A family celebration to keep close."
      eyebrow="FAMILY FESTIVAL"
      className="kds-festival-details-dialog"
    >
      {festival ? (
        <>
          <span className="kds-festival-detail-icon" aria-hidden="true">
            <Icon name="local_florist" size={20} strokeWidth={1.6} />
          </span>
          <p className="kds-festival-detail-description">{festival.description}</p>
          <div className="kds-festival-sync-note">
            <span>Saved in our shared family record</span>
            <span>✳</span>
          </div>
          <div className="kds-dialog-actions kds-dialog-actions-split">
            {isAdmin ? (
              <button
                type="button"
                className="kds-icon-danger"
                aria-label="Delete festival"
                title="Delete"
                onClick={handleDelete}
              >
                <Icon name="delete" size={18} strokeWidth={1.8} />
              </button>
            ) : (
              <span />
            )}
            <div className="kds-dialog-actions-end">
              <Button variant="secondary" type="button" onClick={onClose}>
                Close
              </Button>
              {isAdmin && onEdit ? (
                <Button icon="edit" type="button" onClick={() => onEdit(festival)}>
                  Edit festival
                </Button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </Drawer>
  );
}
