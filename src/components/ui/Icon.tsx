import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Flower2,
  Heart,
  Home,
  Leaf,
  Menu,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  account_tree: Users,
  users: Users,
  people: Users,
  event: CalendarDays,
  calendar_today: CalendarDays,
  calendar_days: CalendarDays,
  history: BookOpen,
  book_open: BookOpen,
  spa: Flower2,
  flower2: Flower2,
  local_florist: Flower2,
  eco: Leaf,
  leaf: Leaf,
  favorite: Heart,
  heart: Heart,
  add: Plus,
  plus: Plus,
  close: X,
  x: X,
  search: Search,
  menu: Menu,
  arrow_forward: ArrowRight,
  south_east: ArrowDownRight,
  edit: Pencil,
  pencil: Pencil,
  delete: Trash2,
  trash: Trash2,
};

type IconProps = {
  name: string;
  className?: string;
  label?: string;
  size?: number;
  strokeWidth?: number;
} & Omit<LucideProps, 'ref'>;

export function Icon({
  name,
  className = '',
  label,
  size = 18,
  strokeWidth = 1.8,
  ...props
}: IconProps) {
  const Lucide = iconMap[name] ?? Sparkles;

  return (
    <Lucide
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...props}
    />
  );
}
