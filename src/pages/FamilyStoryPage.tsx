import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';

export function FamilyStoryPage() {
  return (
    <section className="kds-page" aria-labelledby="story-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>YOUR FAMILY, YOUR STORY</Eyebrow>
          <h1 id="story-title" className="kds-serif">
            Family <em>story</em>
          </h1>
        </div>
      </div>

      <section className="kds-family-story-space" aria-label="Family story space">
        <Icon name="local_florist" size={35} strokeWidth={1} />
      </section>
    </section>
  );
}
