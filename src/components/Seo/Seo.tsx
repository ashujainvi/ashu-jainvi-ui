import { useEffect } from 'react';

const SITE_NAME = 'Ashu Jainvi';
const BASE_URL = 'https://ashujainvi.com';
const DEFAULT_DESCRIPTION = 'Ashu Jainvi is an Austin, Texas-based visual artist and senior UI developer specializing in photography, graphic design, and web development.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalLink(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const Seo = ({ title, description = DEFAULT_DESCRIPTION, path = '', image = DEFAULT_IMAGE, type = 'website' }: SeoProps) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${BASE_URL}${path}`;

    document.title = fullTitle;

    // Standard meta
    setMetaTag('name', 'description', description);

    // Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // Canonical
    setCanonicalLink(canonicalUrl);
  }, [title, description, path, image, type]);

  return null;
};

export default Seo;
