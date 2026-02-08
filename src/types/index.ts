/**
 * ========== BASE INTERFACES ============
 * These are small, reusable building blocks
 */

/** 
 * Standard image properties 
 * Used by: Card, CarouselCard, ContentBlock, CTABanner etc.
*/
export interface ImageProps {
  imageURL: string;
  imageAlt: string;
}


/** 
 * Standard link/navigation properties 
 * Used by: Card, CarouselCard, Button, Navigation
*/
export interface LinkProps {
  href: string;
  buttonLabel: string;
}


/** 
 * Standard heading/title properts 
 * Used by: SectionTitle, TextHero, ContentBlock
*/
export interface HeadingProps {
    headline: string;
    subheadline?: string;
}


/** 
 * Standard heading/title properts 
 * Used by: SectionTitle, TextHero, ContentBlock
*/
export interface TextProps {
    bodyCopy: string;
}


/**
 * Standard size variants
 * Used by: SectionTitle, TextBlock, Button
 */
export type SizeVariant = "small" | "regular" | "large";


/**
 * Standard style variants
 * Used by: Card, Button
 */
export type StyleVariant = "primary" | "secondary" | "tertiary";


/**
 * Standard theme variants
 * Used by: Card, other themed components
 */
export type ThemeVariant = "light" | "dark";


/**
 * ===== COMPONENT-SPECIFIC INTERFACES =====
 * These combine base interface and
 * component-specific properties
 */


/** 
 * Card component props
 * Combines: ImageProps, LinkProps, and adds card-specific options
 */
export interface CardProps extends ImageProps, LinkProps {
  icon?: boolean;
  style?: ThemeVariant;
}


/** 
 * Button component props
 */
export interface ButtonProps extends LinkProps {
    variant: StyleVariant;
    disabled?: boolean;
}


/** 
 * Section Title component props
 */
export interface SectionTitleProps {
    headline: string;
    headingSize?: SizeVariant;
}

/** 
 * Text Block component props
 */
export interface TextBlockProps {
    bodyCopy: string;
    width?: "compact" | "regular";
    fontSize?: SizeVariant | "lede";
}


/**
 * Content Block component props
 * Combines: HeadingProps, TextProps, ImageProps, and adds layout options
 */
export interface ContentBlockProps extends HeadingProps, TextProps, ImageProps {
  imagePosition: "left" | "right";
  showCta?: boolean;
  ctaLabel?: string;
  ctaLink?: string;
}

/** 
 * CTA Banner component props
 */
export interface CtaBannerProps extends HeadingProps, TextProps, ImageProps {
    buttonLabel?: string;
    buttonLink?: string;
}

/**
 * Hero component props
 */
export interface HeroProps {
  videoUrl?: string;
  headline?: string;
}

/**
 * Text Hero component props
 */
export interface TextHeroProps extends HeadingProps {
  // Inherits headline and subheadline from HeadingProps
}

/**
 * Performance Table component props
 */
export interface PerformanceTableProps {
  headers: string[];
  rows: Array<{
    cells: string[];
  }>;
}

/**
 * Spec List component props
 */
export interface SpecListProps {
  title: string;
  data: string;
}

/**
 * Bullet List component props
 */
export interface BulletListProps {
  title?: string;
  items: string[];
}


/**
 * ===== SANITY/CMS DATA TYPES =======
 * These represent the data structure from your CMS
 */


/**
 * Application data from Sanity
 */
export interface Application {
  title: string;
  slug: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
    hotspot?: any;
    crop?: any;
  }>;
  recommendedProducts?: Product[];
}

/**
 * Product data from Sanity
 */
export interface Product {
  title: string;
  slug: string;
  description: string;
  additionalDescription?: string;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
    hotspot?: any;
    crop?: any;
  }>;
  hasDatasheet?: boolean;
  datasheetUrl?: string;
  datasheetFileName?: string;
  availability: string[];
  lede: string;
  productCategory: {
    title: string;
    slug: string;
  };
  featured: boolean;
  order: number;
  // Detailed specs
  performanceSpecs?: PerformanceSpec[];
  physicalSpecs?: PhysicalSpecs;
  engineSpecs?: EngineSpecs;
  buildOptions?: BuildOption[];
  relatedProducts?: Product[];
}

/**
 * Performance specification for products
 */
export interface PerformanceSpec {
  model: string;
  plungerSize: string;
  psi: string;
  bar: string;
  lpm: string;
  gpm: string;
  kw: string;
  hp: string;
}

/**
 * Physical specifications for products
 */
export interface PhysicalSpecs {
  dimensions: string;
  weight: string;
  weightUnit: "kg" | "lbs";
}

/**
 * Engine specifications for products
 */
export interface EngineSpecs {
  manufacturer: string;
  model: string;
  fuelType: string;
  fuelCapacity: string;
  power: string;
}

/**
 * Build option for products
 */
export interface BuildOption {
  code: string;
  description: string;
}

/**
 * Homepage data from Sanity
 */
export interface Homepage {
  heroHeadline: string;
  heroVideoUrl: string;
  productSectionHeadline: string;
  productSectionDescription: string;
  productCards: Array<{
    title: string;
    imageUrl: string;
    imageAlt: string;
    link: string;
  }>;
  ctaBanner?: CtaBannerProps;
  aboutHeadline: string;
  aboutText: string;
  partnerLogos: Array<{
    url: string;
    alt: string;
    partnerUrl?: string;
  }>;
}

/**
 * Services page data from Sanity
 */
export interface ServicesPage {
  heroHeadline: string;
  heroSubheadline: string;
  contentBlocks: Array<{
    title: string;
    description: any; // PortableText type
    imageUrl: string;
    imageAlt: string;
    imagePosition: "left" | "right";
    showCTA: boolean;
    ctaLabel?: string;
    ctaLink?: string;
  }>;
  showContactBanner: boolean;
}