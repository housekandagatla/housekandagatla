import { useState } from 'react';
import { FestivalForm } from '../components/forms/FestivalForm';
import { FestivalDetail } from '../components/tree/FestivalDetail';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import type { Festival } from '../data/types';

const toneIcons = ['local_florist', 'spa', 'favorite', 'event'] as const;

export function FestivalsPage() {
  const { festivals, loading, removeFestival } = useFamily();
  const { isAdmin } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [selected, setSelected] = useState<Festival | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Festival | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openAddForm = () => {
    if (!isAdmin) {
      return;
    }
    setEditingFestival(null);
    setSelected(null);
    setFormOpen(true);
  };

  const openEditForm = (festival: Festival) => {
    if (!isAdmin) {
      return;
    }
    setSelected(null);
    setEditingFestival(festival);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingFestival(null);
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin || !pendingDelete) {
      return;
    }

    setDeleteError(null);
    try {
      await removeFestival(pendingDelete.id);
      if (selected?.id === pendingDelete.id) {
        setSelected(null);
      }
      setPendingDelete(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete festival');
    }
  };

  return (
    <section className="kds-page" aria-labelledby="festivals-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>TOGETHER IS OUR FAVORITE PLACE</Eyebrow>
          <h1 id="festivals-title">
            Family <em>festivals</em>
          </h1>
          <p className="kds-welcome-subtitle">
            The celebrations, reunions, and little moments that bring us home.
          </p>
        </div>
        {isAdmin ? (
          <Button className="kds-top-action" icon="add" onClick={openAddForm}>
            Add a festival
          </Button>
        ) : null}
      </div>

      {loading ? <p className="kds-mini-empty">Loading our festivals…</p> : null}

      {!loading && festivals.length === 0 ? (
        <EmptyState
          kicker="MOMENTS WORTH GATHERING"
          title={
            <>
              Every tradition starts
              <br />
              with a shared <em>moment.</em>
            </>
          }
          description="Add the first festival to begin collecting the celebrations, reunions, and little gatherings that bring our family home."
          footnote="KANDAGATLA FAMILY · CELEBRATING TOGETHER"
          icon="event"
        />
      ) : null}

      {festivals.length > 0 ? (
        <>
          <div className="kds-events-section-title">
            <span className="kds-event-total">
              {festivals.length} {festivals.length === 1 ? 'festival' : 'festivals'}
            </span>
          </div>

          <div className="kds-festival-grid">
            {festivals.map((festival, index) => (
              <article
                key={festival.id}
                className={`kds-festival-card kds-festival-tone-${index % 4}`}
              >
                <span className="kds-festival-card-art" aria-hidden="true">
                  <Icon name={toneIcons[index % toneIcons.length]} size={28} strokeWidth={1.2} />
                </span>
                <div className="kds-festival-card-content">
                  <strong>{festival.title}</strong>
                  <p>{festival.description}</p>
                  <button
                    type="button"
                    className="kds-festival-view-more"
                    onClick={() => setSelected(festival)}
                  >
                    View more <Icon name="arrow_forward" size={14} strokeWidth={2} />
                  </button>
                </div>
                {isAdmin ? (
                  <button
                    type="button"
                    className="kds-festival-card-delete"
                    aria-label={`Delete ${festival.title}`}
                    title="Delete"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(festival);
                    }}
                  >
                    <Icon name="delete" size={16} strokeWidth={1.8} />
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </>
      ) : null}

      {isAdmin ? (
        <FestivalForm open={formOpen} festival={editingFestival} onClose={closeForm} />
      ) : null}
      <FestivalDetail
        festival={selected}
        onClose={() => setSelected(null)}
        onEdit={openEditForm}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Remove “${pendingDelete?.title ?? 'this festival'}”?`}
        description="This festival will be removed from the shared family record."
        confirmLabel="Delete festival"
        error={deleteError}
        onClose={() => {
          setPendingDelete(null);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
