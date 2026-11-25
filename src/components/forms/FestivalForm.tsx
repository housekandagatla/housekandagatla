import { useState, type FormEvent } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';

type FestivalFormProps = {
  open: boolean;
  onClose: () => void;
};

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }

    addFestival({ title, category, description, dateLabel });
    reset();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add a festival"
      subtitle="Keep everyone in the loop for the moments that matter."
      note="Saved in this browser with local storage."
    >
      <form className="kds-form-stack" onSubmit={handleSubmit}>
        <label>
          Festival name
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Diwali gathering"
            required
            autoFocus
          />
        </label>
        <label>
          Category
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Family tradition"
          />
        </label>
        <label>
          Date label
          <input
            value={dateLabel}
            onChange={(event) => setDateLabel(event.target.value)}
            placeholder="e.g. August or TBD"
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What makes this celebration special?"
            rows={3}
            required
          />
        </label>

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
