import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Field } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';
import { TextInput } from '../components/ui/TextInput';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import type { FamilyDeity, HeritageItem } from '../data/types';

export function HeritagePage() {
  const { heritage, updateHeritage, loading } = useFamily();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<HeritageItem[]>(heritage.items);
  const [deity, setDeity] = useState<FamilyDeity>(heritage.deity);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) {
      setItems(heritage.items);
      setDeity(heritage.deity);
    }
  }, [heritage, editing]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateHeritage({ items, deity });
      setEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save heritage';
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="kds-page" aria-labelledby="heritage-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>OUR STORY, OUR ROOTS</Eyebrow>
          <h1 id="heritage-title">
            Our <em>heritage</em>
          </h1>
          <p className="kds-welcome-subtitle">
            The traditions and ties that have been passed down, generation by generation.
          </p>
        </div>
        {isAdmin ? (
          <Button
            className="kds-top-action"
            variant={editing ? 'secondary' : 'primary'}
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? 'Cancel edit' : 'Edit heritage'}
          </Button>
        ) : null}
      </div>

      {loading ? <p className="kds-mini-empty">Loading our heritage…</p> : null}

      {editing ? (
        <form className="kds-form-stack kds-heritage-edit" onSubmit={handleSave}>
          {items.map((item, index) => (
            <div key={item.index ?? index} className="kds-heritage-edit-block">
              <Field label={`Item ${index + 1} Telugu label`} htmlFor={`heritage-te-label-${index}`}>
                <TextInput
                  id={`heritage-te-label-${index}`}
                  value={item.teluguLabel ?? ''}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = { ...item, teluguLabel: event.target.value };
                    setItems(next);
                  }}
                />
              </Field>
              <Field label="English label" htmlFor={`heritage-label-${index}`}>
                <TextInput
                  id={`heritage-label-${index}`}
                  value={item.label}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = { ...item, label: event.target.value };
                    setItems(next);
                  }}
                />
              </Field>
              <Field label="Telugu value" htmlFor={`heritage-te-${index}`}>
                <TextInput
                  id={`heritage-te-${index}`}
                  value={item.telugu}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = { ...item, telugu: event.target.value };
                    setItems(next);
                  }}
                />
              </Field>
              <Field label="English value" htmlFor={`heritage-en-${index}`}>
                <TextInput
                  id={`heritage-en-${index}`}
                  value={item.english}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = { ...item, english: event.target.value };
                    setItems(next);
                  }}
                />
              </Field>
            </div>
          ))}

          <div className="kds-heritage-edit-block">
            <Field label="Deity Telugu label" htmlFor="deity-te-label">
              <TextInput
                id="deity-te-label"
                value={deity.teluguLabel ?? ''}
                onChange={(event) => setDeity({ ...deity, teluguLabel: event.target.value })}
              />
            </Field>
            <Field label="Deity English label" htmlFor="deity-label">
              <TextInput
                id="deity-label"
                value={deity.label}
                onChange={(event) => setDeity({ ...deity, label: event.target.value })}
              />
            </Field>
            <Field label="Deity Telugu value" htmlFor="deity-te">
              <TextInput
                id="deity-te"
                value={deity.telugu}
                onChange={(event) => setDeity({ ...deity, telugu: event.target.value })}
              />
            </Field>
            <Field label="Deity English value" htmlFor="deity-en">
              <TextInput
                id="deity-en"
                value={deity.english}
                onChange={(event) => setDeity({ ...deity, english: event.target.value })}
              />
            </Field>
          </div>

          <div className="kds-dialog-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save heritage'}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <section className="kds-heritage-hero" aria-label="Kandagatla family heritage">
            <div className="kds-heritage-hero-copy">
              <h2 className="kds-serif">
                A name that carries
                <br />
                <i>a thousand stories.</i>
              </h2>
              <p>
                We honor the values, customs, and family ties that make the House of Kandagatla what
                it is — and carry them forward, together.
              </p>
              <span className="kds-heritage-mantra kds-telugu" lang="te">
                మన కుటుంబం · మన వారసత్వం
              </span>
            </div>
            <div className="kds-heritage-hero-flower" aria-hidden="true">
              <Icon name="local_florist" size={124} strokeWidth={0.75} />
            </div>
          </section>

          <div className="kds-heritage-facts">
            {heritage.items.map((item, index) => (
              <article key={item.telugu} className="kds-heritage-card">
                <span className="kds-fact-number">
                  {item.index ?? String(index + 1).padStart(2, '0')}
                </span>
                <span className="kds-heritage-card-meta">
                  <span className="kds-telugu" lang="te">
                    {item.teluguLabel || item.label}
                  </span>
                  {item.teluguLabel && item.label ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>{item.label}</span>
                    </>
                  ) : null}
                </span>
                <h3 className="kds-telugu kds-serif" lang="te">
                  {item.telugu}
                </h3>
                {item.english ? <p>{item.english}</p> : null}
              </article>
            ))}
          </div>

          <section className="kds-deity-card">
            <span className="kds-deity-icon" aria-hidden="true">
              <Icon name="local_florist" size={24} strokeWidth={2} />
            </span>
            <div>
              <span className="kds-heritage-card-meta">
                <span className="kds-telugu" lang="te">
                  {heritage.deity.teluguLabel || heritage.deity.label}
                </span>
                {heritage.deity.teluguLabel && heritage.deity.label ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>{heritage.deity.label}</span>
                  </>
                ) : null}
              </span>
              <h2 className="kds-telugu kds-serif" lang="te">
                {heritage.deity.telugu}
              </h2>
              {heritage.deity.english ? <p>{heritage.deity.english}</p> : null}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
