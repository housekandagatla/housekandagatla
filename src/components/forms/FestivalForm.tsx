import { useEffect, useState, type FormEvent } from 'react';
import { useFamily } from '../../context/FamilyContext';
import type { Festival } from '../../data/types';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Field } from '../ui/Field';
import { TextArea } from '../ui/TextArea';
import { TextInput } from '../ui/TextInput';

type FestivalFormProps = {
  open: boolean;
  onClose: () => void;
  festival?: Festival | null;
};

export function FestivalForm({ open, onClose, festival = null }: FestivalFormProps) {
  const { addFestival, updateFestival } = useFamily();
  const isEditing = Boolean(festival);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (festival) {
      setTitle(festival.title);
      setDescription(festival.description);
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
      const payload = { title, description };
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
        <Field label="Family name" htmlFor="festival-title">
          <TextInput
            id="festival-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Diwali gathering"
            required
            autoFocus
          />
        </Field>

        <Field label="Family description" htmlFor="festival-description">
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
