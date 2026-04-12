import React from 'react';

type SchemaType = 
  | 'Organization' 
  | 'WebSite' 
  | 'BreadcrumbList' 
  | 'SoftwareApplication' 
  | 'Article' 
  | 'ItemList';

interface JsonLdProps {
  type: SchemaType;
  data: any;
}

const JsonLd: React.FC<JsonLdProps> = ({ type, data }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default JsonLd;
