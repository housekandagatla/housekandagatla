import { useFamily } from '../../context/FamilyContext';
import type { Festival } from '../../data/types';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Icon } from '../ui/Icon';

type FestivalDetailProps = {
  festival: Festival | null;
  onClose: () => void;
};

export function FestivalDetail({ festival, onClose }: FestivalDetailProps) {
  const { removeFestival } = useFamily();

  const handleDelete = () => {
    if (!festival) {
      return;
    }

    const confirmed = window.confirm(`Delete “${festival.title}” from family festivals?`);
    if (!confirmed) {
      return;
    }

    removeFestival(festival.id);
    onClose();
  };

  return (
    <Drawer
      open={Boolean(festival)}
      onClose={onClose}
      title={festival?.title ?? 'Festival'}
      subtitle="A family celebration to keep close."
      eyebrow="FAMILY FESTIVAL"
    >
      {festival ? (
        <>
          <span className="kds-festival-detail-icon" aria-hidden="true">
            <Icon name="local_florist" size={20} />
          </span>
          <span className="kds-sample-detail-label">{festival.category}</span>
          <p className="kds-festival-detail-description">{festival.description}</p>
          <div className="kds-festival-detail-list">
            <div>
              <Icon name="event" size={16} />
              <span>{festival.dateLabel || 'Date to be decided'}</span>
            </div>
            <div>
              <Icon name="spa" size={16} />
              <span>House of Kandagatla tradition</span>
            </div>
          </div>
          <div className="kds-festival-sync-note">
            <span>Saved locally in this browser</span>
            <span>✳</span>
          </div>
          <div className="kds-dialog-actions kds-dialog-actions-split">
            <Button variant="danger" type="button" icon="delete" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      ) : null}
    </Drawer>
  );
}
