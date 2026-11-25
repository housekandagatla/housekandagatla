import { useLayoutEffect, useMemo, useState, type FormEvent } from 'react';
import { useFamily, type MemberInput } from '../../context/FamilyContext';
import { RELATIONSHIPS, type FamilyMember, type Relationship } from '../../data/types';
import { getSpouseOf, isSpouse } from '../../utils/buildFamilyTree';
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

function coupleLabel(person: FamilyMember, spouse?: FamilyMember) {
  if (!spouse) {
    return person.fullName;
  }
  return `${person.fullName} & ${spouse.fullName}`;
}

export function MemberForm({ open, onClose, connectToId, member = null }: MemberFormProps) {
  const { members, addMember, updateMember } = useFamily();
  const isEditing = Boolean(member);
  const [fullName, setFullName] = useState('');
  const [connectedToId, setConnectedToId] = useState(ROOT_VALUE);
  const [relationship, setRelationship] = useState<string>('Son');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [about, setAbout] = useState('');
  const [place, setPlace] = useState('');
  const [saving, setSaving] = useState(false);

  const normalizeConnectId = (id?: string) => {
    if (!id) {
      return ROOT_VALUE;
    }
    const person = members.find((item) => item.id === id);
    if (!person) {
      return id;
    }
    const spouse = getSpouseOf(person, members);
    if (spouse && isSpouse(person.relationship)) {
      return spouse.id;
    }
    return id;
  };

  const memberOptions = useMemo(() => {
    const options = [{ value: ROOT_VALUE, label: 'Add as a family root' }];
    const seen = new Set<string>();

    members.forEach((item) => {
      if (item.id === member?.id || seen.has(item.id)) {
        return;
      }

      const spouse = getSpouseOf(item, members);
      if (spouse && spouse.id !== member?.id) {
        const primary = isSpouse(item.relationship) ? spouse : item;
        const partner = primary.id === item.id ? spouse : item;
        if (seen.has(primary.id)) {
          return;
        }
        seen.add(primary.id);
        seen.add(partner.id);
        options.push({
          value: primary.id,
          label: `${primary.fullName} & ${partner.fullName}`,
        });
        return;
      }

      seen.add(item.id);
      options.push({ value: item.id, label: item.fullName });
    });

    return options;
  }, [members, member?.id]);

  const relationshipOptions = useMemo(
    () => RELATIONSHIPS.map((item) => ({ value: item, label: item })),
    [],
  );

  const resolvedConnectId = useMemo(() => {
    if (connectedToId && connectedToId !== ROOT_VALUE) {
      return connectedToId;
    }
    if (!isEditing && connectToId) {
      return normalizeConnectId(connectToId);
    }
    return ROOT_VALUE;
  }, [connectedToId, connectToId, isEditing, members]);

  const connectedPerson = useMemo(
    () => members.find((item) => item.id === resolvedConnectId),
    [members, resolvedConnectId],
  );
  const connectedSpouse = useMemo(
    () => (connectedPerson ? getSpouseOf(connectedPerson, members) : undefined),
    [connectedPerson, members],
  );

  const placementLabel = useMemo(() => {
    if (!isEditing || !connectedPerson || resolvedConnectId === ROOT_VALUE) {
      return null;
    }
    if (isSpouse(relationship)) {
      return `${relationship} of ${connectedPerson.fullName}`;
    }
    return `${relationship} of ${coupleLabel(connectedPerson, connectedSpouse)}`;
  }, [isEditing, connectedPerson, connectedSpouse, resolvedConnectId, relationship]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    if (member) {
      setFullName(member.fullName);
      setConnectedToId(
        member.isRoot || !member.connectedToId
          ? ROOT_VALUE
          : normalizeConnectId(member.connectedToId),
      );
      setRelationship(member.relationship || 'Family member');
      setDateOfBirth(member.dateOfBirth || '');
      setAbout(member.about || '');
      setPlace(member.place || '');
      return;
    }

    setFullName('');
    setConnectedToId(normalizeConnectId(connectToId));
    setRelationship(connectToId ? 'Son' : 'Family member');
    setDateOfBirth('');
    setAbout('');
    setPlace('');
  }, [open, connectToId, member?.id]);

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
      title={isEditing ? 'Edit family member' : 'Add family member'}
      subtitle={undefined}
      note={undefined}
    >
      <form className="kds-form-stack" onSubmit={handleSubmit}>
        {placementLabel ? (
          <div className="kds-member-placement" aria-live="polite">
            <span className="kds-member-placement-label">Placing as</span>
            <strong>{placementLabel}</strong>
          </div>
        ) : null}

        <Field label="Full name" htmlFor="member-full-name">
          <TextInput
            id="member-full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            autoFocus
          />
        </Field>

        <Field label="Connect to a family member">
          <SelectField
            value={connectedToId}
            onValueChange={setConnectedToId}
            options={memberOptions}
            placeholder=""
            aria-label="Connect to a family member"
          />
        </Field>

        <Field label="Relationship to them">
          <SelectField
            value={relationship}
            onValueChange={setRelationship}
            options={relationshipOptions}
            placeholder=""
            required
            aria-label="Relationship to them"
          />
        </Field>

        <Field label="Date of birth" htmlFor="member-dob">
          <DatePickerField
            id="member-dob"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            placeholder=""
          />
        </Field>

        <Field label="About this person" htmlFor="member-about">
          <TextArea
            id="member-about"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            rows={3}
          />
        </Field>

        <Field label="Place" htmlFor="member-place">
          <TextInput
            id="member-place"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
          />
        </Field>

        <div className="kds-dialog-actions">
          <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" icon={isEditing ? 'check' : 'add'} disabled={saving}>
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
