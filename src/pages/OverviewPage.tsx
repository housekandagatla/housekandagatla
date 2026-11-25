import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { OverviewSkeleton } from '../components/ui/Skeleton';
import { StatCard } from '../components/ui/StatCard';
import { WeaverMark } from '../components/ui/WeaverMark';

export function OverviewPage() {
  const { members, festivals, heritage, loading } = useFamily();
  const { isAdmin } = useAuth();
  const previewFestivals = festivals.slice(0, 2);
  const previewMembers = members.slice(0, 3);
  const heritageFacts = [
    ...heritage.items.map((item) => {
      const label = item.teluguLabel?.trim();
      return {
        key: `${item.index ?? item.label}-${item.telugu}`,
        te: label ? `${label} — ${item.telugu}` : item.telugu,
      };
    }),
    {
      key: `deity-${heritage.deity.telugu}`,
      te: heritage.deity.teluguLabel?.trim()
        ? `${heritage.deity.teluguLabel.trim()} — ${heritage.deity.telugu}`
        : heritage.deity.telugu,
    },
  ];

  return (
    <section className="kds-page" aria-labelledby="overview-title">
      <div className="kds-welcome-row">
        <div>
          <Eyebrow mark>OUR FAMILY, OUR STORY</Eyebrow>
          <h1 id="overview-title">
            Welcome to the <em>family</em>
          </h1>
          <p className="kds-welcome-subtitle">
            A place to remember where we come from, and celebrate all that we are.
          </p>
        </div>
      </div>

      {loading ? (
        <OverviewSkeleton />
      ) : (
        <>
          <section className="kds-heritage-banner" aria-label="A legacy in every generation">
            <div className="kds-banner-text">
              <span className="kds-banner-kicker">A LEGACY IN EVERY GENERATION</span>
              <h2>
                One family.
                <br />
                <i>Many stories.</i>
              </h2>
              <p>
                Our roots run deep. Let&apos;s keep the people, traditions, and moments that make us who
                we are — all in one place.
              </p>
            </div>

            <div className="kds-banner-art" aria-hidden="true">
              <span className="kds-art-ring kds-ring-one" />
              <span className="kds-art-ring kds-ring-two" />
              <span className="kds-art-ring kds-ring-three" />
              <span className="kds-art-center">
                <WeaverMark size={96} />
              </span>
              <span className="kds-art-dot kds-dot-one" />
              <span className="kds-art-dot kds-dot-two" />
              <span className="kds-art-dot kds-dot-three" />
              <span className="kds-art-dot kds-dot-four" />
              <span className="kds-art-caption">EST. THROUGH GENERATIONS</span>
            </div>

            <span className="kds-banner-corner" aria-hidden="true">
              ✳
            </span>

            <div className="kds-banner-roots">
              <span className="kds-banner-roots-mark">
                <Icon name="spa" size={16} strokeWidth={1.8} />
              </span>
              <div className="kds-banner-roots-content">
                <span className="kds-banner-roots-label">THE ROOTS THAT CONNECT US</span>
                <div className="kds-banner-roots-facts">
                  {heritageFacts.map((fact, index) => (
                    <span key={fact.key}>
                      {index > 0 ? (
                        <span className="kds-roots-divider" aria-hidden="true">
                          ·
                        </span>
                      ) : null}
                      <span className="kds-telugu" lang="te">
                        {fact.te}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <Link className="kds-inline-link" to="/heritage">
                Our heritage <Icon name="arrow_forward" size={14} strokeWidth={2} />
              </Link>
            </div>
          </section>

          <section className="kds-stat-row" aria-label="Family at a glance">
            <StatCard
              value={members.length}
              label="Family members"
              icon="people"
              tone="green"
              to="/family-tree"
              actionLabel="View family tree"
            />
            <StatCard
              value={festivals.length}
              label="Family festivals"
              icon="event"
              tone="gold"
              to="/festivals"
              actionLabel="View family festivals"
            />
            <StatCard
              value={1}
              label="Shared heritage"
              icon="favorite"
              tone="rose"
              to="/heritage"
              actionLabel="View our heritage"
            />
          </section>

          <div className="kds-overview-grid">
            <section className="kds-content-panel">
              <div className="kds-panel-heading">
                <div>
                  <Eyebrow>OUR PEOPLE</Eyebrow>
                  <h2>Family tree</h2>
                </div>
              </div>

              {previewMembers.length === 0 ? (
                <p className="kds-mini-empty">Our family story starts in the family tree.</p>
              ) : (
                <div className="kds-mini-members">
                  <span className="kds-tree-stem" aria-hidden="true" />
                  {previewMembers.map((member) => (
                    <article key={member.id} className="kds-mini-member">
                      <span className="kds-mini-avatar">
                        {member.fullName.charAt(0).toUpperCase()}
                      </span>
                      <span className="kds-mini-member-copy">
                        <strong>{member.fullName}</strong>
                        <small>
                          {member.isRoot
                            ? 'Family root'
                            : member.relationship ?? 'Family member'}
                        </small>
                      </span>
                    </article>
                  ))}
                  {isAdmin ? (
                    <Link className="kds-tree-add-node" to="/family-tree">
                      <span className="kds-node-plus" aria-hidden="true">
                        <Icon name="add" size={16} strokeWidth={2} />
                      </span>
                      <span>
                        <strong>Add someone</strong>
                        <small>Grow the family tree</small>
                      </span>
                    </Link>
                  ) : null}
                </div>
              )}

              <div className="kds-panel-footer">
                <Link className="kds-text-link" to="/family-tree">
                  View the tree <Icon name="arrow_forward" size={14} strokeWidth={2} />
                </Link>
              </div>
            </section>

            <section className="kds-content-panel">
              <div className="kds-panel-heading">
                <div>
                  <Eyebrow>MAKE MEMORIES</Eyebrow>
                  <h2>Family festivals</h2>
                </div>
              </div>

              {previewFestivals.length === 0 ? (
                <p className="kds-mini-empty">Our festivals and gatherings will appear here.</p>
              ) : (
                <div className="kds-event-list">
                  {previewFestivals.map((festival) => (
                    <Link key={festival.id} className="kds-event-card" to="/festivals">
                      <div className="kds-event-info">
                        <h3>{festival.title}</h3>
                        <p className="kds-event-preview">{festival.description}</p>
                      </div>
                      <Icon name="arrow_forward" className="kds-event-arrow" size={16} strokeWidth={1.8} />
                    </Link>
                  ))}
                </div>
              )}

              <div className="kds-panel-footer">
                <Link className="kds-text-link" to="/festivals">
                  View festivals <Icon name="arrow_forward" size={14} strokeWidth={2} />
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}
