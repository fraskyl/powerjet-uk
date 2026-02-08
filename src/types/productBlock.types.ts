// src/types/product.ts
// Updated product types with composable content blocks

/**
 * ===== PRODUCT CONTENT BLOCKS =====
 * Individual block type definitions
 */

// Performance Table with custom columns
export interface ColumnHeader {
  label: string;
  key: string;
}

export interface TableCell {
  value: string;
}

export interface TableRow {
  rowLabel?: string;
  cells: TableCell[];
}

export interface PerformanceTableBlock {
  _type: 'performanceTableBlock';
  _key: string;
  sectionTitle?: string;
  columnHeaders?: ColumnHeader[];
  rows?: TableRow[];
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface PhysicalSpecsBlock {
  _type: 'physicalSpecsBlock';
  _key: string;
  sectionTitle?: string;
  specs?: SpecItem[];
}

export interface EngineSpecsBlock {
  _type: 'engineSpecsBlock';
  _key: string;
  sectionTitle?: string;
  specs?: SpecItem[];
}

export interface BuildOption {
  code?: string;
  description?: string;
}

export interface BuildOptionsBlock {
  _type: 'buildOptionsBlock';
  _key: string;
  sectionTitle?: string;
  options?: BuildOption[];
}

export interface KeySpecsBlock {
  _type: 'keySpecsBlock';
  _key: string;
  sectionTitle?: string;
  specs?: SpecItem[];
}

export interface CustomContentBlock {
  _type: 'customContentBlock';
  _key: string;
  sectionTitle: string;
  content?: any; // PortableText content
}

/**
 * Union type of all possible content blocks
 */
export type ProductContentBlock =
  | PerformanceTableBlock
  | PhysicalSpecsBlock
  | EngineSpecsBlock
  | BuildOptionsBlock
  | KeySpecsBlock
  | CustomContentBlock;

/**
 * ===== MAIN PRODUCT INTERFACE =====
 */
export interface Product {
  // Basic Information (Always required)
  _id?: string;
  title: string;
  slug: string;
  lede?: string;
  description?: any; // PortableText
  mainImageUrl: string;
  mainImageAlt: string;
  
  // Categorization
  availability?: ('rental' | 'sale')[];
  productCategory?: {
    title: string;
    slug: string;
  };
  
  // Composable Content Blocks (The main change!)
  contentBlocks?: ProductContentBlock[];
  
  // Additional Files
  dataSheetUrl?: string;
  
  // Related Products
  relatedProducts?: Array<{
    title: string;
    slug: string;
    imageUrl: string;
    imageAlt: string;
  }>;
  
  // Display Options
  featured?: boolean;
  order?: number;
}

/**
 * ===== LEGACY COMPATIBILITY =====
 * For gradual migration from old structure to new
 */
export interface LegacyProduct {
  // Old structure fields...
  performanceSpecs?: PerformanceSpec[];
  physicalSpecs?: {
    dimensions?: string;
    weight?: string;
  };
  engineSpecs?: {
    manufacturer?: string;
    model?: string;
    fuelType?: string;
    fuelCapacity?: string;
    power?: string;
  };
  buildOptions?: BuildOption[];
  keySpecs?: SpecItem[];
}

/**
 * ===== HELPER TYPES =====
 */

// For components that need to render specific blocks
export interface ProductDetailLayoutProps {
  title: string;
  product: Product;
}

// For listing pages
export interface ProductCardData {
  title: string;
  slug: string;
  imageUrl: string;
  imageAlt: string;
  availability?: string[];
  productCategory?: {
    title: string;
    slug: string;
  };
  featured?: boolean;
}

// For type guards
export function isPerformanceTableBlock(block: ProductContentBlock): block is PerformanceTableBlock {
  return block._type === 'performanceTableBlock';
}

export function isPhysicalSpecsBlock(block: ProductContentBlock): block is PhysicalSpecsBlock {
  return block._type === 'physicalSpecsBlock';
}

export function isEngineSpecsBlock(block: ProductContentBlock): block is EngineSpecsBlock {
  return block._type === 'engineSpecsBlock';
}

export function isBuildOptionsBlock(block: ProductContentBlock): block is BuildOptionsBlock {
  return block._type === 'buildOptionsBlock';
}

export function isKeySpecsBlock(block: ProductContentBlock): block is KeySpecsBlock {
  return block._type === 'keySpecsBlock';
}

export function isCustomContentBlock(block: ProductContentBlock): block is CustomContentBlock {
  return block._type === 'customContentBlock';
}