import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { familyDeity, heritageItems } from '../data/seed';

export function HeritagePage() {
  return (
    <section className="kds-page" aria-labelledby="heritage-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>OUR STORY, OUR ROOTS</Eyebrow>
          <h1 id="heritage-title">
            A heritage <em>held close</em>
          </h1>
          <p className="kds-welcome-subtitle">
            The traditions and ties that have been passed down, generation by generation.
          </p>
        </div>
      </div>

      <section className="kds-heritage-hero" aria-label="Kandagatla family heritage">
        <div className="kds-heritage-hero-copy">
          <span className="kds-banner-kicker">KANDAGATLA FAMILY · TELANGANA</span>
          <h2 className="kds-serif">
            A name that carries
            <br />
            <i>a thousand stories.</i>
          </h2>
          <p>
            We honor the values, customs, and family ties that make the House of Kandagatla what
            it is — and carry them forward, together.
          </p>
          <span className="kds-heritage-mantra kds-telugu" lang="te">
            మన కుటుంబం · మన వారసత్వం
          </span>
        </div>
        <div className="kds-heritage-hero-flower" aria-hidden="true">
          <Icon name="local_florist" size={124} strokeWidth={0.75} />
        </div>
      </section>

      <div className="kds-heritage-facts">
        {heritageItems.map((item) => (
          <article key={item.telugu}>
            {item.index ? <span className="kds-fact-number">{item.index}</span> : null}
            <span className="kds-eyebrow">{item.label.toUpperCase()}</span>
            <h3 className="kds-telugu kds-serif" lang="te">
              {item.telugu}
            </h3>
            <p>{item.english}</p>
          </article>
        ))}
      </div>

      <section className="kds-deity-card">
        <span className="kds-deity-icon" aria-hidden="true">
          <Icon name="local_florist" size={23} strokeWidth={2} />
        </span>
        <div>
          <span className="kds-eyebrow">{familyDeity.label.toUpperCase()}</span>
          <h2 className="kds-telugu kds-serif" lang="te">
            {familyDeity.telugu}
          </h2>
          <p>{familyDeity.english}</p>
        </div>
        <span className="kds-deity-mark" aria-hidden="true">
          ✳
        </span>
      </section>
    </section>
  );
}
