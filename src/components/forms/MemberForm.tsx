import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useFamily, type MemberInput } from '../../context/FamilyContext';
import { RELATIONSHIPS, type FamilyMember, type Relationship } from '../../data/types';
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
  member?: FamilyMember | null;
};

const ROOT_VALUE = '__root__';

export function MemberForm({ open, onClose, connectToId, member = null }: MemberFormProps) {
  const { members, addMember, updateMember } = useFamily();
  const isEditing = Boolean(member);
  const [fullName, setFullName] = useState('');
  const [connectedToId, setConnectedToId] = useState(ROOT_VALUE);
  const [relationship, setRelationship] = useState<string>('Family member');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [about, setAbout] = useState('');
  const [place, setPlace] = useState('');
  const [saving, setSaving] = useState(false);

  const memberOptions = useMemo(
    () => [
      { value: ROOT_VALUE, label: 'Add as a family root' },
      ...members
        .filter((item) => item.id !== member?.id)
        .map((item) => ({ value: item.id, label: item.fullName })),
    ],
    [members, member?.id],
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
    if (!open) {
      return;
    }

    if (member) {
      setFullName(member.fullName);
      setConnectedToId(member.isRoot || !member.connectedToId ? ROOT_VALUE : member.connectedToId);
      setRelationship(member.relationship || 'Family member');
      setDateOfBirth(member.dateOfBirth || '');
      setAbout(member.about || '');
      setPlace(member.place || '');
      return;
    }

    reset();
    setConnectedToId(connectToId ?? ROOT_VALUE);
    setRelationship('Family member');
  }, [open, connectToId, member]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) {
      return;
    }

    const isRoot = connectedToId === ROOT_VALUE || (!isEditing && members.length === 0);
    const payload: MemberInput = {
      fullName,
      isRoot,
      connectedToId: isRoot ? undefined : connectedToId,
      relationship: isRoot ? undefined : (relationship as Relationship) || 'Family member',
      dateOfBirth,
      about,
      place,
    };

    setSaving(true);
    try {
      if (member) {
        await updateMember(member.id, payload);
      } else {
        await addMember(payload);
      }
      reset();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save member';
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Update their place in the tree' : 'Welcome them to the tree'}
      subtitle={
        isEditing
          ? 'Keep their story accurate as the family grows.'
          : 'Every name carries a story worth keeping.'
      }
      note="Saved to our shared family record."
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
          <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" icon={isEditing ? 'edit' : 'add'} disabled={saving}>
            {saving
              ? 'Saving…'
              : isEditing
                ? 'Save changes'
                : 'Add to family tree'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
