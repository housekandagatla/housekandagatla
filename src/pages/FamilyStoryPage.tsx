import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Field } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';
import { FamilyStorySkeleton } from '../components/ui/Skeleton';
import { TextArea } from '../components/ui/TextArea';
import { TextInput } from '../components/ui/TextInput';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';

export function FamilyStoryPage() {
  const { story, updateStory, loading } = useFamily();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(story.title);
  const [body, setBody] = useState(story.body);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) {
      setTitle(story.title);
      setBody(story.body);
    }
  }, [story, editing]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateStory({ title, body });
      setEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save story';
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="kds-page" aria-labelledby="story-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>OUR FAMILY, OUR STORY</Eyebrow>
          <h1 id="story-title" className="kds-serif">
            Family <em>story</em>
          </h1>
        </div>
        {isAdmin ? (
          <Button
            className="kds-top-action"
            variant={editing ? 'secondary' : 'primary'}
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? 'Cancel edit' : 'Edit story'}
          </Button>
        ) : null}
      </div>

      {loading ? <FamilyStorySkeleton /> : null}

      {!loading && editing ? (
        <form className="kds-form-stack" onSubmit={handleSave}>
          <Field label="Title" htmlFor="story-heading">
            <TextInput
              id="story-heading"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Our family story"
              required
            />
          </Field>
          <Field label="Story" htmlFor="story-body">
            <TextArea
              id="story-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share where we come from, and the people who shaped us…"
              rows={12}
            />
          </Field>
          <div className="kds-dialog-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save story'}
            </Button>
          </div>
        </form>
      ) : !loading && story.body.trim() ? (
        <article className="kds-family-story-content">
          <h2 className="kds-serif">{story.title}</h2>
          <p className="kds-family-story-body">{story.body}</p>
          {story.updatedAt ? (
            <p className="kds-mini-empty">
              Updated{' '}
              {new Date(story.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          ) : null}
        </article>
      ) : !loading ? (
        <section className="kds-family-story-space" aria-label="Family story space">
          <Icon name="book_open" size={35} strokeWidth={1} />
          <p className="kds-mini-empty">
            {isAdmin
              ? 'Our story is waiting to be written. Sign in as admin and add the first chapter.'
              : 'Our family story will appear here soon.'}
          </p>
        </section>
      ) : null}
    </section>
  );
}
