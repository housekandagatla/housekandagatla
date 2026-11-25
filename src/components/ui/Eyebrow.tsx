type EyebrowProps = {
  children: string;
  mark?: boolean;
};

export function Eyebrow({ children, mark = false }: EyebrowProps) {
  return (
    <p className="kds-eyebrow">
      {mark ? (
        <span className="kds-eyebrow-mark" aria-hidden="true">
          ✳
        </span>
      ) : null}
      {children}
    </p>
  );
}
