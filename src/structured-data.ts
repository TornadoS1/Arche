// schema.org JSON-LD for search engines. All URLs point at the production domain.
import { SITE_NAME } from './nav';

const SITE = import.meta.env.SITE;
const abs = (path: string) => new URL(path, SITE).href;

const author = {
  '@type': 'Person',
  name: 'Martin Schönebeck',
  url: abs('/ueber/'),
};

export function websiteSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    name: SITE_NAME,
    url: abs('/'),
    description,
    inLanguage: 'de-DE',
    publisher: author,
  };
}

interface PageInfo {
  path: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  updated?: Date;
}

export function articleSchema(page: PageInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.headline,
    description: page.description,
    url: abs(page.path),
    mainEntityOfPage: abs(page.path),
    image: abs(page.image),
    inLanguage: 'de-DE',
    author,
    publisher: author,
    isPartOf: { '@id': abs('/#website') },
    ...(page.updated && { dateModified: page.updated.toISOString().slice(0, 10) }),
  };
}

export function breadcrumbSchema(page: Pick<PageInfo, 'path' | 'title'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: abs('/') },
      { '@type': 'ListItem', position: 2, name: page.title, item: abs(page.path) },
    ],
  };
}
