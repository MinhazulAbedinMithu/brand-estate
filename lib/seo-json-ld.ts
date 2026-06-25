import { getAppUrl } from "./utils";

const APP_URL = getAppUrl();

/**
 * Generates the master Organization schema for Brand Estate.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${APP_URL}/#organization`,
    "name": "Brand Estate",
    "url": APP_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${APP_URL}/logo.png`,
      "width": "112",
      "height": "28"
    },
    "image": `${APP_URL}/og-image.png`,
    "description": "Brand Estate is a premium real estate SaaS directory platform bridging high-end properties with verified local agents.",
    "sameAs": [
      "https://facebook.com/brandestate",
      "https://twitter.com/brandestate",
      "https://linkedin.com/company/brandestate",
      "https://instagram.com/brandestate"
    ]
  };
}

/**
 * Generates the WebSite schema with SearchAction integration.
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${APP_URL}/#website`,
    "url": APP_URL,
    "name": "Brand Estate",
    "description": "Premium Real Estate SaaS Portal",
    "publisher": {
      "@id": `${APP_URL}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${APP_URL}/properties?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generates structured data for a property listing.
 * Resolves to category-specific types (Apartment, House, CommercialProperty, etc.) with clean fallbacks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPropertySchema(property: any) {
  if (!property) return null;

  // Map category to standard Schema.org Types
  let schemaType = "SingleFamilyResidence";
  const category = (property.propertyCategory || "").toLowerCase().trim();
  if (category === "apartment") {
    schemaType = "Apartment";
  } else if (category === "house" || category === "villa") {
    schemaType = "House";
  } else if (category === "commercial") {
    schemaType = "CommercialProperty";
  } else if (category === "land") {
    schemaType = "Landform";
  }

  // Format fallbacks for address
  const street = property.formattedAddress || "Global Directory";
  const city = property.city || "";
  const region = property.state || "";
  const postalCode = property.zipCode || "";
  const country = property.listerProfile?.location?.country || "US";

  // Build offeredBy RealEstateAgent/Person block
  let agentSchema = null;
  if (property.listerProfile) {
    agentSchema = {
      "@type": "RealEstateAgent",
      "name": property.listerProfile.name || "Brand Estate Professional",
      "image": property.listerProfile.avatar || `${APP_URL}/og-image.png`,
      "telephone": property.listerProfile.phone || "",
      "email": property.listerProfile.email || "",
      "url": property.listerProfile.slug ? `${APP_URL}/agents/${property.listerProfile.slug}` : undefined
    };
  }

  // Prepare images array
  const images = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : [`${APP_URL}/og-image.png`];

  // Set pricing availability URI
  const availability = property.status === "active" 
    ? "https://schema.org/InStock" 
    : "https://schema.org/OutOfStock";

  // Quantitative value for floor size
  const floorSize = property.squareFeet 
    ? {
        "@type": "QuantitativeValue",
        "value": property.squareFeet,
        "unitCode": "FTK" // square feet code
      }
    : undefined;

  // Lat/Lng geo coordinates
  const lat = property._geo?.lat;
  const lng = property._geo?.lng;
  const geoCoordinates = (lat !== undefined && lng !== undefined)
    ? {
        "@type": "GeoCoordinates",
        "latitude": lat,
        "longitude": lng
      }
    : undefined;

  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": property.title || "Premium Real Estate Property",
    "description": property.seo?.metaDescription || property.description || "A luxury real estate property listing on Brand Estate.",
    "image": images,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": street,
      "addressLocality": city,
      "addressRegion": region,
      "postalCode": postalCode,
      "addressCountry": country
    },
    "geo": geoCoordinates,
    "numberOfBedrooms": property.bedrooms || undefined,
    "numberOfBathrooms": property.bathrooms || undefined,
    "floorSize": floorSize,
    "offers": {
      "@type": "Offer",
      "price": property.price || 0,
      "priceCurrency": property.currency || "USD",
      "priceValidUntil": validUntil.toISOString().split("T")[0],
      "url": `${APP_URL}/property/${property.slug || ""}`,
      "availability": availability,
      "offeredBy": agentSchema || {
        "@type": "Organization",
        "name": "Brand Estate"
      }
    }
  };
}

/**
 * Generates the BlogPosting schema for blog posts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBlogPostSchema(post: any) {
  if (!post) return null;

  const title = post.title || "Real Estate Insights";
  const desc = post.excerpt || post.seo?.metaDescription || "Expert advice and guides on real estate investments and buying guides.";
  const image = post.coverImage || post.seo?.ogImage || `${APP_URL}/og-image.png`;
  
  // Format date correctly
  let datePub = post.publishedAt || post.createdAt;
  if (datePub instanceof Date) {
    datePub = datePub.toISOString();
  } else if (!datePub) {
    datePub = new Date().toISOString();
  }

  let dateMod = post.updatedAt || post.publishedAt || post.createdAt;
  if (dateMod instanceof Date) {
    dateMod = dateMod.toISOString();
  } else if (!dateMod) {
    dateMod = new Date().toISOString();
  }

  const authorName = post.author?.name || "Brand Estate Contributor";
  const authorSlug = authorName.toLowerCase().replace(/\s+/g, "-");

  const keywords = Array.isArray(post.seo?.keywords) && post.seo.keywords.length > 0
    ? post.seo.keywords.join(", ")
    : Array.isArray(post.tags) ? post.tags.join(", ") : "";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.seo?.canonicalUrl || `${APP_URL}/blogs/${post.slug || ""}`
    },
    "headline": title,
    "description": desc,
    "image": image,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": `${APP_URL}/agents/${authorSlug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Brand Estate",
      "logo": {
        "@type": "ImageObject",
        "url": `${APP_URL}/logo.png`
      }
    },
    "datePublished": datePub,
    "dateModified": dateMod,
    "keywords": keywords || undefined
  };
}

/**
 * Generates the RealEstateAgent profile schema.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAgentSchema(agent: any) {
  if (!agent) return null;

  const name = agent.name || "Real Estate Professional";
  const image = agent.avatar || agent.coverImage || `${APP_URL}/og-image.png`;
  const desc = agent.bio || `Meet ${name}, professional real estate agent at Brand Estate.`;
  const phone = agent.phone || "";
  const email = agent.email || "";

  const city = agent.location?.city || "";
  const state = agent.location?.state || "";
  const country = agent.location?.country || "US";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": name,
    "image": image,
    "description": desc,
    "telephone": phone || undefined,
    "email": email || undefined,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city || undefined,
      "addressRegion": state || undefined,
      "addressCountry": country
    },
    "priceRange": "$$$",
    "areaServed": city || undefined,
    "knowsLanguage": Array.isArray(agent.languages) && agent.languages.length > 0 ? agent.languages : ["English"],
    "knowsAbout": Array.isArray(agent.specializations) ? agent.specializations : []
  };
}

/**
 * Generates structured data for the About Page.
 */
export function getAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${APP_URL}/about/#webpage`,
    "url": `${APP_URL}/about`,
    "name": "About Us | Brand Estate",
    "description": "Discover our real estate legacy, global operations milestones, and meet our executive team.",
    "about": {
      "@id": `${APP_URL}/#organization`
    }
  };
}

/**
 * Generates structured data for the Contact Page.
 */
export function getContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${APP_URL}/contact/#webpage`,
    "url": `${APP_URL}/contact`,
    "name": "Contact Us | Brand Estate",
    "description": "Have questions regarding property directory listings or our SaaS broker console subscriptions? Drop us a line.",
    "mainEntity": {
      "@id": `${APP_URL}/#organization`
    }
  };
}
