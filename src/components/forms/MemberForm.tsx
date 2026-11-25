import { useEffect, useState, type FormEvent } from 'react';
import { useFamily, type MemberInput } from '../../context/FamilyContext';
import { RELATIONSHIPS, type Relationship } from '../../data/types';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';

type MemberFormProps = {
  open: boolean;
  onClose: () => void;
  connectToId?: string;
};

export function MemberForm({ open, onClose, connectToId }: MemberFormProps) {
  const { members, addMember } = useFamily();
  const [fullName, setFullName] = useState('');
  const [connectedToId, setConnectedToId] = useState('');
  const [relationship, setRelationship] = useState<Relationship | ''>('Family member');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [about, setAbout] = useState('');
  const [place, setPlace] = useState('');

  const reset = () => {
    setFullName('');
    setConnectedToId(connectToId ?? '');
    setRelationship('Family member');
    setDateOfBirth('');
    setAbout('');
    setPlace('');
  };

  useEffect(() => {
    if (open) {
      setConnectedToId(connectToId ?? '');
      setRelationship('Family member');
    }
  }, [open, connectToId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) {
      return;
    }

    const isRoot = !connectedToId || members.length === 0;
    const payload: MemberInput = {
      fullName,
      isRoot,
      connectedToId: isRoot ? undefined : connectedToId,
      relationship: isRoot ? undefined : relationship || 'Family member',
      dateOfBirth,
      about,
      place,
    };

    addMember(payload);
    reset();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Welcome them to the tree"
      subtitle="Every name carries a story worth keeping."
      note="Saved in this browser with local storage."
    >
      <form className="kds-form-stack" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="e.g. Sita Kandagatla"
            required
            autoFocus
          />
        </label>

        <label>
          Connect to a family member
          <select
            value={connectedToId}
            onChange={(event) => setConnectedToId(event.target.value)}
          >
            <option value="">Add as a family root</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Relationship to them
          <select
            value={relationship}
            onChange={(event) => setRelationship(event.target.value as Relationship | '')}
            required
          >
            <option value="">Choose relationship</option>
            {RELATIONSHIPS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date of birth
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </label>

        <label>
          About this person
          <textarea
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder="A few words about them…"
            rows={3}
          />
        </label>

        <label>
          Place
          <input
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Add a town or venue"
          />
        </label>

        <div className="kds-dialog-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon="add">
            Add to family tree
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
