const IconBase = ({ size = 16, className = "", children }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
};

export const UsersIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M20 8v6" />
    <path d="M23 11h-6" />
  </IconBase>
);

export const Building2Icon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18" />
    <path d="M3 22h18" />
    <path d="M10 7h4" />
    <path d="M10 11h4" />
    <path d="M10 15h4" />
    <path d="M10 22v-3h4v3" />
  </IconBase>
);

export const AlertTriangleIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </IconBase>
);

export const Clock3Icon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5h4" />
  </IconBase>
);

export const FilterIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M22 3H2l8 9v7l4 2v-9z" />
  </IconBase>
);

export const ListTodoIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M9 6h11" />
    <path d="M9 12h11" />
    <path d="M9 18h11" />
    <path d="m3 6 1 1 2-2" />
    <path d="m3 12 1 1 2-2" />
    <path d="m3 18 1 1 2-2" />
  </IconBase>
);

export const SearchIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
);

export const SlidersHorizontalIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="12" cy="18" r="2" />
  </IconBase>
);

export const CalendarDaysIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </IconBase>
);

export const InboxIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z" />
  </IconBase>
);
