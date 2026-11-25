import type { CSSProperties, ReactNode } from 'react';

type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  style?: CSSProperties;
};

export function Skeleton({
  className = '',
  width,
  height,
  radius,
  style,
}: SkeletonProps) {
  return (
    <span
      className={`kds-skeleton${className ? ` ${className}` : ''}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

type SkeletonBlockProps = {
  className?: string;
  label?: string;
  children: ReactNode;
};

export function SkeletonBlock({
  className = '',
  label = 'Loading content',
  children,
}: SkeletonBlockProps) {
  return (
    <div
      className={`kds-skeleton-block${className ? ` ${className}` : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <SkeletonBlock className="kds-skeleton-overview" label="Loading overview">
      <div className="kds-skeleton-banner">
        <div className="kds-skeleton-stack">
          <Skeleton width="40%" height={12} />
          <Skeleton width="70%" height={28} />
          <Skeleton width="55%" height={28} />
          <Skeleton width="85%" height={12} />
          <Skeleton width="75%" height={12} />
        </div>
        <Skeleton className="kds-skeleton-circle" width={120} height={120} radius="50%" />
      </div>

      <div className="kds-skeleton-stat-row">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="kds-skeleton-stat">
            <Skeleton width={40} height={28} />
            <Skeleton width="60%" height={12} />
            <Skeleton width="40%" height={12} />
          </div>
        ))}
      </div>

      <div className="kds-skeleton-overview-grid">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="kds-skeleton-panel">
            <Skeleton width="30%" height={12} />
            <Skeleton width="50%" height={22} />
            <div className="kds-skeleton-stack">
              <Skeleton height={48} radius={12} />
              <Skeleton height={48} radius={12} />
              <Skeleton height={48} radius={12} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonBlock>
  );
}

export function FamilyTreeSkeleton() {
  return (
    <SkeletonBlock className="kds-skeleton-tree" label="Loading family tree">
      <div className="kds-skeleton-toolbar">
        <Skeleton height={40} radius={8} className="kds-skeleton-search" />
        <Skeleton width={160} height={32} radius={999} />
      </div>
      <div className="kds-skeleton-tree-canvas">
        <div className="kds-skeleton-tree-row">
          <Skeleton className="kds-skeleton-card" height={72} radius={12} />
          <Skeleton className="kds-skeleton-card" height={72} radius={12} />
        </div>
        <div className="kds-skeleton-tree-row">
          <Skeleton className="kds-skeleton-card" height={72} radius={12} />
          <Skeleton className="kds-skeleton-card" height={72} radius={12} />
          <Skeleton className="kds-skeleton-card" height={72} radius={12} />
        </div>
        <div className="kds-skeleton-tree-row">
          <Skeleton className="kds-skeleton-card" height={72} radius={12} />
        </div>
      </div>
    </SkeletonBlock>
  );
}

export function FestivalsSkeleton() {
  return (
    <SkeletonBlock className="kds-skeleton-festivals" label="Loading festivals">
      <Skeleton width={120} height={14} />
      <div className="kds-skeleton-festival-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="kds-skeleton-festival-card">
            <Skeleton className="kds-skeleton-circle" width={48} height={48} radius="50%" />
            <div className="kds-skeleton-stack">
              <Skeleton width="70%" height={18} />
              <Skeleton width="95%" height={12} />
              <Skeleton width="80%" height={12} />
              <Skeleton width="40%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonBlock>
  );
}

export function HeritageSkeleton() {
  return (
    <SkeletonBlock className="kds-skeleton-heritage" label="Loading heritage">
      <div className="kds-skeleton-heritage-hero">
        <div className="kds-skeleton-stack">
          <Skeleton width="65%" height={28} />
          <Skeleton width="50%" height={28} />
          <Skeleton width="90%" height={12} />
          <Skeleton width="80%" height={12} />
          <Skeleton width="45%" height={16} />
        </div>
        <Skeleton className="kds-skeleton-circle" width={120} height={120} radius="50%" />
      </div>
      <div className="kds-skeleton-heritage-facts">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="kds-skeleton-heritage-card">
            <Skeleton width={28} height={14} />
            <Skeleton width="40%" height={12} />
            <Skeleton width="70%" height={24} />
            <Skeleton width="55%" height={12} />
          </div>
        ))}
      </div>
      <div className="kds-skeleton-deity">
        <Skeleton className="kds-skeleton-circle" width={48} height={48} radius="50%" />
        <div className="kds-skeleton-stack">
          <Skeleton width="35%" height={12} />
          <Skeleton width="55%" height={24} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
    </SkeletonBlock>
  );
}

export function FamilyStorySkeleton() {
  return (
    <SkeletonBlock className="kds-skeleton-story" label="Loading family story">
      <div className="kds-skeleton-stack kds-skeleton-story-body">
        <Skeleton width="45%" height={28} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="98%" height={14} />
        <Skeleton width="92%" height={14} />
        <Skeleton width="96%" height={14} />
        <Skeleton width="88%" height={14} />
        <Skeleton width="94%" height={14} />
        <Skeleton width="70%" height={14} />
        <Skeleton width={140} height={12} />
      </div>
    </SkeletonBlock>
  );
}
