// Main navigation. Slugs match the old Google Sites URLs (except /oekologie).
export const mainNav = [
  { href: '/geologie/', label: 'Geologie' },
  { href: '/biogeographie/', label: 'Biogeographie' },
  { href: '/biologie-genetik/', label: 'Biologie & Genetik' },
  { href: '/oekologie/', label: 'Ökologie' },
];

export const footerNav = [
  { href: '/rechtliches/#impressum', label: 'Impressum' },
  { href: '/rechtliches/#datenschutz', label: 'Datenschutz' },
];

export const SITE_NAME = 'Arche Noah Mythos';

// Base path without trailing slash: '' in production, e.g. '/Arche' for the github.io preview
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// Prefix a root-relative path with the configured base
export const withBase = (path: string) => `${BASE}${path}`;
