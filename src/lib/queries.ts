// Query to fetch homepage data
export const homepageQuery = `
  *[_type == "homepage"][0] {
    heroHeadline,
    "heroVideoUrl": heroVideo.asset->url,

    productSectionHeadline,
    productSectionDescription,

    "productCards" : productCards[]-> {
    _id,
    title,
    "imageUrl" : mainImage.asset->url,
    "imageAlt" : mainImage.alt,
    link
    },

    "ctaBanner" : ctaBanner -> {
    headline,
    bodyCopy,
    buttonLabel,
    "imageUrl" : mainImage.asset->url,
    "imageAlt" : mainImage.alt
    },

    aboutHeadline,
    aboutText,
    "partnerLogos": partnerLogos[] {
      "url": asset->url,
      alt,
      "partnerUrl": url
    }
  }
`

export const servicesPageQuery = `
  *[_type == "servicesPage" && _id == "servicesPage"][0] {
  title,
  heroHeadline,
  heroSubheadline,
  
  contentBlocks[] {
  title,
  description,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  imagePosition,
  showCTA,
  ctaLabel,
  ctaLink}
  ,
  
  showContactBanner
  }
`

/**
 *  ===== Applications Query ======
*/
export const applicationsIndexQuery = `*[_type == "application"] | order(order asc, title asc) {
  title,
  "slug": slug.current,
  images[] {
      "url": asset->url,
      alt,
      caption,
      "hotspot": asset->hotspot,
      "crop": asset->crop
    },
  order
}`;

// Query to get a single application by slug for detail pages
// Returns complete application data
export const applicationBySlugQuery = `*[_type == "application" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  lede,
  description,
  images[] {
      "url": asset->url,
      alt,
      caption
    },
  "imageUrl":mainImage.asset->url,
  "imageAlt": mainImage.alt,
  recommendedProducts[]->{
    title,
    "slug": slug.current,
    images[] {
      "url": asset->url,
      alt
      },
    "imageUrl": images[0].asset->url,
    "imageAlt": images[0].alt
  }
}`;

// Query to get all application slugs (for generating static paths)
export const applicationSlugsQuery = `*[_type == "application"]{"slug": slug.current}`;

/**
 * Product Type Queries
 */

// Get all product types for tab navigation
export const productCategorysQuery = `*[_type == "productCategory"] | order(order asc, title asc) {
  title,
  "slug": slug.current,
  description,
  order
}`;

/**
 * Product Queries
*/

export const allProductsQuery = `*[_type == "product"] | order(order asc, _createdAt desc) {
  title,
  "slug": slug.current,
  availability,
  lede,
  "productCategory": productCategory->{
    title,
    "slug": slug.current
  },
  images[] {
  "url": asset->url,
  alt
  },
  "imageUrl": images[0].asset->url,
  "imageAlt": images[0].alt
}`;


// Temporary debug query - shows ALL fields
//export const allProductsQuery = `*[_type == "product"][0...3]`;

// Get products filtered by availability (rental or sale)
export const productsByAvailabilityQuery = `*[_type == "product" && $availability in availability] | order(desc, order asc, title asc) {
  title,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  lede,
  availability,
  "productCategory": productCategory->{
    title,
    "slug": slug.current
  },
  order
}`;

// Get single product by slug for detail page
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  lede,
  description,
  images[] {
      "url": asset->url,
      alt,
      caption,
      "hotspot": asset->hotspot,
      "crop": asset->crop
    },
  availability,
  "productCategory": productCategory->{
    title,
    "slug": slug.current
  },
  // Datasheet fields
  hasDatasheet,
  "datasheetUrl": datasheet.asset->url,
  "datasheetFileName": datasheet.asset->originalFilename,
  // Composable content blocks
    contentBlocks[] {
      _type,
      _key,
      
      // Performance Table Block - Now with custom columns
      _type == "performanceTableBlock" => {
        sectionTitle,
        columnHeaders[] {
          label,
        },
        rows[] {
          rowLabel,
          cells[] {
            value
          }
        }
      },
      
      // Physical Specs Block
      _type == "physicalSpecsBlock" => {
        sectionTitle,
        specs[] {
          label,
          value
        }
      },
      
      // Engine Specs Block
      _type == "engineSpecsBlock" => {
        sectionTitle,
        specs[] {
          label,
          value
        }
      },
      
      // Build Options Block
      _type == "buildOptionsBlock" => {
        sectionTitle,
        options[] {
          code,
          description
        }
      },
      
      // Key Specs Block
      _type == "keySpecsBlock" => {
        sectionTitle,
        specs[] {
          label,
          value
        }
      },
      
      // Custom Content Block
      _type == "customContentBlock" => {
        sectionTitle,
        content
      }
    },
  relatedProducts[]->{
    title,
    "slug": slug.current,
    "imageUrl": images[0].asset->url,
    "imageAlt": images[0].alt
  }
}`;

// ═══════════════════════════════════════════════════════════════════
// Template Library Queries
// ═══════════════════════════════════════════════════════════════════

export const allPerformanceTableTemplatesQuery = `
  *[_type == "performanceTableTemplate"] | order(templateName asc) {
    _id,
    templateName,
    description,
    sectionTitle,
    columnHeaders,
    exampleRows
  }
`;

export const allSpecsListTemplatesQuery = `
  *[_type == "specsListTemplate"] | order(templateName asc) {
    _id,
    templateName,
    templateType,
    description,
    sectionTitle,
    specFields
  }
`;

export const allBuildOptionsTemplatesQuery = `
  *[_type == "buildOptionsTemplate"] | order(templateName asc) {
    _id,
    templateName,
    description,
    sectionTitle,
    options
  }
`;

export const allCustomContentTemplatesQuery = `
  *[_type == "customContentTemplate"] | order(templateName asc) {
    _id,
    templateName,
    description,
    sectionTitle,
    content
  }
`;

// ═══════════════════════════════════════════════════════════════════
// Get specific template by ID
// ═══════════════════════════════════════════════════════════════════

export const getTemplateByIdQuery = (templateType: string) => `
  *[_type == "${templateType}" && _id == $templateId][0] {
    _id,
    templateName,
    description,
    sectionTitle,
    
    // Type-specific fields
    _type == "performanceTableTemplate" => {
      columnHeaders,
      exampleRows
    },
    
    _type == "specsListTemplate" => {
      templateType,
      specFields
    },
    
    _type == "buildOptionsTemplate" => {
      options
    },
    
    _type == "customContentTemplate" => {
      content
    }
  }
`;


// Get all product slugs for static path generation
 export const productSlugsQuery = `*[_type == "product"]{"slug": slug.current}`;



// Get only top-level categories for main tabs
export const topLevelProductCategoriesQuery = `
  *[_type == "productCategory" && !defined(parentCategory) && $availability in availability] | order(order asc) {
    title,
    "slug": slug.current,
    _id,
    description,
    order,
    availability
  }
`;

// Get category hierarchy for a specific parent
export const categoryHierarchyQuery = `
  *[_type == "productCategory" && slug.current == $parentSlug][0] {
    title,
    "slug": slug.current,
    "subcategories": *[_type == "productCategory" && parentCategory._ref == ^._id] | order(order asc) {
      title,
      "slug": slug.current,
      _id,
      "subcategories": *[_type == "productCategory" && parentCategory._ref == ^._id] | order(order asc) {
        title,
        "slug": slug.current,
        _id
      }
    }
  }
`;

export const allProductsWithCategoriesQuery = `
  *[_type == "product" && $availability in availability] | order(desc, order asc, title asc) {
    title,
    "slug": slug.current,
    imageUrl,
    imageAlt,
    availability,
    order,
    images[] {
      "url": asset->url,
      "alt": alt
    },
    productCategory->{
      title,
      "slug": slug.current,
      _id,
      "parent": parentCategory->{
        title,
        "slug": slug.current,
        _id,
        "parent": parentCategory->{
          title,
          "slug": slug.current,
          _id
        }
      }
    }
  }
`;

export const allProductCategoriesWithParentsQuery = `
  *[_type == "productCategory" && $availability in availability] | order(order asc, title asc) {
    title,
    "slug": slug.current,
    _id,
    order,
    availability,
    "parentSlug": parentCategory->slug.current,
    "parentId": parentCategory->_id
  }
`;




// Query for just CTA banners (for other pages)
export const ctaBannersQuery = `
  *[_type == "ctaBanner"] | order(_createdAt desc) {
    _id,
    title,
    headline,
    bodyCopy,
    buttonLabel,
    buttonLink,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
  }
`

// Query specific CTA banner by ID
export const ctaBannerByIdQuery = `
  *[_type == "ctaBanner" && _id == $id][0] {
    headline,
    bodyCopy,
    buttonLabel,
    buttonLink,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
  }
`

/**
 * Contact Page Query
 */
export const contactPageQuery = `*[_type == "contactPage"][0]{
  // Contact Info fields
  phone,
  phoneDisplay,
  email,
  showEmailPublicly,
  address,
  openingHours,
  mapUrl,
  
  // Form Settings fields
  formRecipientEmail,
  formSubjectPrefix,
  enableHoneypot,
  enableAutoReply,
  autoReplySubject,
  autoReplyMessage,
  requiredFields,
  successMessage
}`;