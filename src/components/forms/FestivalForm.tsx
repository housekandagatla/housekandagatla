import { useState, type FormEvent } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Field } from '../ui/Field';
import { SelectField } from '../ui/SelectField';
import { TextArea } from '../ui/TextArea';
import { TextInput } from '../ui/TextInput';

type FestivalFormProps = {
  open: boolean;
  onClose: () => void;
};

const CATEGORY_OPTIONS = [
  { value: 'Family tradition', label: 'Family tradition' },
  { value: 'Festival of lights', label: 'Festival of lights' },
  { value: 'Family gathering', label: 'Family gathering' },
  { value: 'Celebration', label: 'Celebration' },
  { value: 'Other', label: 'Other' },
];

export function FestivalForm({ open, onClose }: FestivalFormProps) {
  const { addFestival } = useFamily();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Family tradition');
  const [description, setDescription] = useState('');
  const [dateLabel, setDateLabel] = useState('');

  const reset = () => {
    setTitle('');
    setCategory('Family tradition');
    setDescription('');
    setDateLabel('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }

    try {
      await addFestival({ title, category, description, dateLabel });
      reset();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save festival';
      window.alert(message);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add a festival"
      subtitle="Keep everyone in the loop for the moments that matter."
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
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon="add">
            Save festival
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
