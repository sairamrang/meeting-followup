// Template types

// Template section structure
export interface TemplateSection {
  type: 'recap' | 'nextSteps' | 'aboutUs' | 'caseStudy' | 'pricing' | 'teamBios' | 'custom';
  title: string;
  content?: string; // Default content (optional)
  libraryRefs?: string[]; // Default library item IDs
}

// Template structure
export interface TemplateStructure {
  sections: TemplateSection[];
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  structure: TemplateStructure;
  createdAt: Date;
  updatedAt: Date;
}

// API types for creating/updating templates
export interface CreateTemplateDTO {
  name: string;
  slug: string;
  description?: string;
  structure: TemplateStructure;
}

export interface UpdateTemplateDTO {
  name?: string;
  slug?: string;
  description?: string;
  structure?: TemplateStructure;
}

// Pre-defined template types
export type TemplateSlug =
  | 'sales-discovery'
  | 'partnership-meeting'
  | 'product-demo'
  | 'technical-discussion'
  | 'follow-up-call'
  | 'custom';
