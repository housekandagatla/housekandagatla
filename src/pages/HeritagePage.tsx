import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Field } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';
import { TextArea } from '../components/ui/TextArea';
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
            A heritage <em>held close</em>
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
              <Field label={`Item ${index + 1} label`} htmlFor={`heritage-label-${index}`}>
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
              <Field label="Telugu" htmlFor={`heritage-te-${index}`}>
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
              <Field label="English" htmlFor={`heritage-en-${index}`}>
                <TextArea
                  id={`heritage-en-${index}`}
                  value={item.english}
                  rows={2}
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
            <Field label="Deity label" htmlFor="deity-label">
              <TextInput
                id="deity-label"
                value={deity.label}
                onChange={(event) => setDeity({ ...deity, label: event.target.value })}
              />
            </Field>
            <Field label="Deity Telugu" htmlFor="deity-te">
              <TextInput
                id="deity-te"
                value={deity.telugu}
                onChange={(event) => setDeity({ ...deity, telugu: event.target.value })}
              />
            </Field>
            <Field label="Deity English" htmlFor="deity-en">
              <TextArea
                id="deity-en"
                value={deity.english}
                rows={2}
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
              <span className="kds-banner-kicker">KANDAGATLA FAMILY · TELANGANA</span>
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
            {heritage.items.map((item) => (
              <article key={item.telugu}>
                {item.index ? <span className="kds-fact-number">{item.index}</span> : null}
                <span className="kds-eyebrow">{item.label.toUpperCase()}</span>
                <h3 className="kds-telugu kds-serif" lang="te">
                  {item.telugu}
                </h3>
                <p>{item.english}</p>
              </article>
            ))}
          </div>

          <section className="kds-deity-card">
            <span className="kds-deity-icon" aria-hidden="true">
              <Icon name="local_florist" size={23} strokeWidth={2} />
            </span>
            <div>
              <span className="kds-eyebrow">{heritage.deity.label.toUpperCase()}</span>
              <h2 className="kds-telugu kds-serif" lang="te">
                {heritage.deity.telugu}
              </h2>
              <p>{heritage.deity.english}</p>
            </div>
            <span className="kds-deity-mark" aria-hidden="true">
              ✳
            </span>
          </section>
        </>
      )}
    </section>
  );
}
