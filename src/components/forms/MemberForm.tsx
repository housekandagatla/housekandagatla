import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useFamily, type MemberInput } from '../../context/FamilyContext';
import { RELATIONSHIPS, type Relationship } from '../../data/types';
import { Button } from '../ui/Button';
import { DatePickerField } from '../ui/DatePickerField';
import { Drawer } from '../ui/Drawer';
import { Field } from '../ui/Field';
import { SelectField } from '../ui/SelectField';
import { TextArea } from '../ui/TextArea';
import { TextInput } from '../ui/TextInput';

type MemberFormProps = {
  open: boolean;
  onClose: () => void;
  connectToId?: string;
};

const ROOT_VALUE = '__root__';

export function MemberForm({ open, onClose, connectToId }: MemberFormProps) {
  const { members, addMember } = useFamily();
  const [fullName, setFullName] = useState('');
  const [connectedToId, setConnectedToId] = useState(ROOT_VALUE);
  const [relationship, setRelationship] = useState<string>('Family member');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [about, setAbout] = useState('');
  const [place, setPlace] = useState('');

  const memberOptions = useMemo(
    () => [
      { value: ROOT_VALUE, label: 'Add as a family root' },
      ...members.map((member) => ({ value: member.id, label: member.fullName })),
    ],
    [members],
  );

  const relationshipOptions = useMemo(
    () => RELATIONSHIPS.map((item) => ({ value: item, label: item })),
    [],
  );

  const reset = () => {
    setFullName('');
    setConnectedToId(connectToId ?? ROOT_VALUE);
    setRelationship('Family member');
    setDateOfBirth('');
    setAbout('');
    setPlace('');
  };

  useEffect(() => {
    if (open) {
      setConnectedToId(connectToId ?? ROOT_VALUE);
      setRelationship('Family member');
    }
  }, [open, connectToId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) {
      return;
    }

    const isRoot = connectedToId === ROOT_VALUE || members.length === 0;
    const payload: MemberInput = {
      fullName,
      isRoot,
      connectedToId: isRoot ? undefined : connectedToId,
      relationship: isRoot ? undefined : (relationship as Relationship) || 'Family member',
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
        <Field label="Full name" htmlFor="member-full-name">
          <TextInput
            id="member-full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="e.g. Sita Kandagatla"
            required
            autoFocus
          />
        </Field>

        <Field label="Connect to a family member">
          <SelectField
            value={connectedToId}
            onValueChange={setConnectedToId}
            options={memberOptions}
            placeholder="Add as a family root"
            aria-label="Connect to a family member"
          />
        </Field>

        <Field label="Relationship to them">
          <SelectField
            value={relationship}
            onValueChange={setRelationship}
            options={relationshipOptions}
            placeholder="Choose relationship"
            required
            aria-label="Relationship to them"
          />
        </Field>

        <Field label="Date of birth" htmlFor="member-dob">
          <DatePickerField
            id="member-dob"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            placeholder="Pick a date of birth"
          />
        </Field>

        <Field label="About this person" htmlFor="member-about">
          <TextArea
            id="member-about"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder="A few words about them…"
            rows={3}
          />
        </Field>

        <Field label="Place" htmlFor="member-place">
          <TextInput
            id="member-place"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Add a town or venue"
          />
        </Field>

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
