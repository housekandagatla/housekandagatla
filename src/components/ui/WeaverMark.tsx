import type { ImgHTMLAttributes } from 'react';
import weaverMark from '../../assets/weaver-mark.jpg';

type WeaverMarkProps = {
  size?: number;
  className?: string;
  label?: string;
  /** Kept for Icon-like API compatibility. */
  strokeWidth?: number;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>;

/** Brand mark: weaver at the handloom — House Kandagatla. */
export function WeaverMark({
  size = 24,
  className = '',
  label = 'House Kandagatla',
  strokeWidth: _strokeWidth,
  ...props
}: WeaverMarkProps) {
  return (
    <img
      src={weaverMark}
      alt={label}
      width={size}
      height={size}
      className={`kds-weaver-mark${className ? ` ${className}` : ''}`}
      draggable={false}
      decoding="async"
      {...props}
    />
  );
}
