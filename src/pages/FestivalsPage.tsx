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
  const { festivals, removeFestival } = useFamily();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Festival | null>(null);

  const handleDelete = (festival: Festival) => {
    const confirmed = window.confirm(`Delete “${festival.title}” from family festivals?`);
    if (!confirmed) {
      return;
    }

    removeFestival(festival.id);
    setSelected((current) => (current?.id === festival.id ? null : current));
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
        <Button className="kds-top-action" icon="add" onClick={() => setFormOpen(true)}>
          Add a festival
        </Button>
      </div>

      <section className="kds-events-intro">
        <span className="kds-events-intro-icon" aria-hidden="true">
          <Icon name="calendar_today" size={23} strokeWidth={2} />
        </span>
        <div>
          <Eyebrow>FESTIVALS &amp; CELEBRATIONS</Eyebrow>
          <h2>A reason to come together.</h2>
          <p>Keep everyone in the loop and make room for the moments that matter.</p>
        </div>
        <span className="kds-events-intro-mark" aria-hidden="true">
          ✳
        </span>
      </section>

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
            className={`kds-festival-card kds-festival-tone-${index % 4} transition-transform duration-200 hover:-translate-y-0.5`}
          >
            <span className="kds-festival-card-art" aria-hidden="true">
              <Icon name={toneIcons[index % toneIcons.length]} size={28} strokeWidth={1.2} />
            </span>
            <div className="kds-festival-card-content">
              <span className="kds-festival-kind">{festival.category}</span>
              <strong>{festival.title}</strong>
              <p>{festival.description}</p>
              <div className="kds-festival-card-actions">
                <button
                  type="button"
                  className="kds-festival-view-more transition-colors duration-150"
                  onClick={() => setSelected(festival)}
                >
                  View more <Icon name="arrow_forward" size={14} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="kds-festival-delete transition-colors duration-150"
                  aria-label={`Delete ${festival.title}`}
                  onClick={() => handleDelete(festival)}
                >
                  <Icon name="delete" size={14} strokeWidth={1.8} />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="kds-festivals-footer-row">
        <p className="kds-member-count">Festival traditions for the whole family</p>
        <Button icon="add" onClick={() => setFormOpen(true)}>
          Add a festival
        </Button>
      </div>

      <FestivalForm open={formOpen} onClose={() => setFormOpen(false)} />
      <FestivalDetail festival={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
