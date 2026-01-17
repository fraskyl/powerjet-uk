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
    description: string;
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