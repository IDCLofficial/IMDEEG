// Structured Data / JSON-LD Components for SEO
// These components add rich snippet data to help search engines understand page content

export interface StructuredDataProps {
  pageType: 'Organization' | 'WebPage' | 'Dataset' | 'FAQPage' | 'LocalBusiness';
  [key: string]: any;
}

/**
 * Organization Schema - For the main organization
 * Helps search engines understand the organization's basic information
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Imo State Ministry of Digital Economy and E-Governance',
    alternateName: 'IMDEEG',
    url: 'https://mdeeg.im.gov.ng',
    logo: 'https://mdeeg.im.gov.ng/logo.png',
    description: 'Driving digital transformation and e-governance in Imo State',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Imo',
      addressLocality: 'Owerri',
      streetAddress: 'Imo State Secretariat Complex',
    },
    telephone: '+234-803-123-4567', // Update with actual number
    email: 'contact@mdeeg.im.gov.ng',
    sameAs: [
      'https://www.facebook.com/imodeeg',
      'https://www.twitter.com/imodeeg',
      'https://www.instagram.com/imodeeg',
      'https://www.linkedin.com/company/imodeeg',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['en'],
      telephone: '+234-803-123-4567',
      email: 'contact@mdeeg.im.gov.ng',
    },
    founder: {
      '@type': 'Organization',
      name: 'Imo State Government',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * LocalBusiness Schema - For physical office locations
 */
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Imo State Ministry of Digital Economy and E-Governance',
    image: 'https://mdeeg.im.gov.ng/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Imo State Secretariat Complex',
      addressLocality: 'Owerri',
      addressRegion: 'IM',
      postalCode: '460241',
      addressCountry: 'NG',
    },
    telephone: '+234-803-123-4567',
    email: 'contact@mdeeg.im.gov.ng',
    url: 'https://mdeeg.im.gov.ng',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Dataset Schema - For the data page with statistics
 */
export function DatasetSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'SkillUp Imo Training Program Data',
    description:
      'Comprehensive dataset on SkillUp Imo digital training program participants, including demographics, course enrollment, and geographical distribution across Imo State',
    url: 'https://mdeeg.im.gov.ng/data',
    identifier: 'skillup-imo-data-2024',
    keywords: [
      'training data',
      'digital skills',
      'SkillUp Imo',
      'Imo State',
      'participant statistics',
    ],
    creator: {
      '@type': 'Organization',
      name: 'Imo State Ministry of Digital Economy and E-Governance',
    },
    datePublished: new Date().toISOString().split('T')[0],
    spatialCoverage: {
      '@type': 'Place',
      name: 'Imo State, Nigeria',
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'JSON',
        contentUrl: 'https://mdeeg.im.gov.ng/WEBSITE_DATA.json',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb Schema - For navigation hierarchy
 */
export function BreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage Schema - For FAQ sections
 */
export function FAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebPage Schema - For individual pages with specific content
 */
export function WebPageSchema(props: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: props.title,
    description: props.description,
    url: props.url,
    image: props.imageUrl,
    datePublished: props.datePublished || new Date().toISOString(),
    dateModified: props.dateModified || new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Imo State Ministry of Digital Economy and E-Governance',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mdeeg.im.gov.ng/logo.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
