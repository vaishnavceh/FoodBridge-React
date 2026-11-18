export const ROLES = {
  DONOR: 'donor',
  NGO: 'ngo',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin'
};

export const ROLE_THEMES = {
  donor: {
    name: 'Food Donor',
    accent: '#38bdf8', // Blue
    border: 'border-sky-500/30',
    bgLight: 'bg-sky-500/10',
    textAccent: 'text-sky-400',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  },
  ngo: {
    name: 'NGO Recipient',
    accent: '#10b981', // Green
    border: 'border-emerald-500/30',
    bgLight: 'bg-emerald-500/10',
    textAccent: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  volunteer: {
    name: 'Volunteer Hero',
    accent: '#f59e0b', // Amber
    border: 'border-amber-500/30',
    bgLight: 'bg-amber-500/10',
    textAccent: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  admin: {
    name: 'Staff Administrator',
    accent: '#fbbf24', // Gold
    border: 'border-yellow-500/30',
    bgLight: 'bg-yellow-500/10',
    textAccent: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  }
};
