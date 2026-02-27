import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  type?: 'website' | 'article';
  schema?: any;
}

export const SEO: React.FC<SEOProps> = ({ title, description, type = 'website', schema }) => {
  useEffect(() => {
    document.title = `${title} | RetireWise`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Schema.org JSON-LD
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, schema]);

  return null;
};
