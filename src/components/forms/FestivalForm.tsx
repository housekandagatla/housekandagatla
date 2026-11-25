import { useEffect, useState, type FormEvent } from 'react';
import { useFamily } from '../../context/FamilyContext';
import type { Festival } from '../../data/types';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Field } from '../ui/Field';
import { SelectField } from '../ui/SelectField';
import { TextArea } from '../ui/TextArea';
import { TextInput } from '../ui/TextInput';

type FestivalFormProps = {
  open: boolean;
  onClose: () => void;
  festival?: Festival | null;
};

const CATEGORY_OPTIONS = [
  { value: 'Family tradition', label: 'Family tradition' },
  { value: 'Festival of lights', label: 'Festival of lights' },
  { value: 'Family gathering', label: 'Family gathering' },
  { value: 'Celebration', label: 'Celebration' },
  { value: 'Other', label: 'Other' },
];

export function FestivalForm({ open, onClose, festival = null }: FestivalFormProps) {
  const { addFestival, updateFestival } = useFamily();
  const isEditing = Boolean(festival);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Family tradition');
  const [description, setDescription] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setCategory('Family tradition');
    setDescription('');
    setDateLabel('');
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (festival) {
      setTitle(festival.title);
      setCategory(festival.category || 'Family tradition');
      setDescription(festival.description);
      setDateLabel(festival.dateLabel === '—' ? '' : festival.dateLabel || '');
      return;
    }

    reset();
  }, [open, festival]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }

    setSaving(true);
    try {
      const payload = { title, category, description, dateLabel };
      if (festival) {
        await updateFestival(festival.id, payload);
      } else {
        await addFestival(payload);
      }
      reset();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save festival';
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit festival' : 'Add a festival'}
      subtitle={
        isEditing
          ? 'Update the celebration details for the family.'
          : 'Keep everyone in the loop for the moments that matter.'
      }
      note="Saved to our shared family record."
    >
      <form className="kds-form-stack" onSubmit={handleSubmit}>
        <Field label="Festival name" htmlFor="festival-title">
          <TextInput
            id="festival-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Diwali gathering"
            required
            autoFocus
          />
        </Field>

        <Field label="Category">
          <SelectField
            value={category}
            onValueChange={setCategory}
            options={CATEGORY_OPTIONS}
            placeholder="Choose category"
            aria-label="Festival category"
          />
        </Field>

        <Field label="Date label" htmlFor="festival-date">
          <TextInput
            id="festival-date"
            value={dateLabel}
            onChange={(event) => setDateLabel(event.target.value)}
            placeholder="e.g. August or TBD"
          />
        </Field>

        <Field label="Description" htmlFor="festival-description">
          <TextArea
            id="festival-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What makes this celebration special?"
            rows={3}
            required
          />
        </Field>

        <div className="kds-dialog-actions">
          <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" icon={isEditing ? 'edit' : 'add'} disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Save festival'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
