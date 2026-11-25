import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import type { Festival } from '../../data/types';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!festival) {
      return;
    }

    setError(null);
    try {
      await removeFestival(festival.id);
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete festival');
    }
  };

  return (
    <>
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
            {isAdmin ? (
              <div className="kds-detail-icon-actions kds-detail-icon-actions-float">
                {onEdit ? (
                  <button
                    type="button"
                    className="kds-detail-icon-button"
                    aria-label={`Edit ${festival.title}`}
                    title="Edit"
                    onClick={() => onEdit(festival)}
                  >
                    <Icon name="edit" size={14} strokeWidth={1.8} />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="kds-icon-danger"
                  aria-label={`Delete ${festival.title}`}
                  title="Delete"
                  onClick={() => {
                    setError(null);
                    setConfirmOpen(true);
                  }}
                >
                  <Icon name="delete" size={14} strokeWidth={1.8} />
                </button>
              </div>
            ) : null}

            <span className="kds-festival-detail-icon" aria-hidden="true">
              <Icon name="local_florist" size={20} strokeWidth={1.6} />
            </span>
            <p className="kds-festival-detail-description">{festival.description}</p>
            <div className="kds-festival-sync-note">
              <span>Saved in our shared family record</span>
              <span>✳</span>
            </div>
            <div className="kds-dialog-actions">
              <Button variant="secondary" type="button" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={confirmOpen && Boolean(festival)}
        title={`Remove “${festival?.title ?? 'this festival'}”?`}
        description="This festival will be removed from the shared family record."
        confirmLabel="Delete festival"
        error={error}
        onClose={() => {
          setConfirmOpen(false);
          setError(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
