import { useState } from 'react';
import { FestivalForm } from '../components/forms/FestivalForm';
import { FestivalDetail } from '../components/tree/FestivalDetail';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { useFamily } from '../context/FamilyContext';
import type { Festival } from '../data/types';

const toneIcons = ['local_florist', 'spa', 'favorite', 'event'] as const;

export function FestivalsPage() {
  const { festivals } = useFamily();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Festival | null>(null);

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
        <Button className="kds-top-action" icon="add" onClick={() => setFormOpen(true)}>
          Add a festival
        </Button>
      </div>

      <div className="kds-events-section-title">
        <div>
          <Eyebrow>OUR FAMILY TRADITIONS</Eyebrow>
          <h2>Festival collection</h2>
        </div>
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
              <span className="kds-festival-kind">{festival.category}</span>
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
          </article>
        ))}
      </div>

      <FestivalForm open={formOpen} onClose={() => setFormOpen(false)} />
      <FestivalDetail festival={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
