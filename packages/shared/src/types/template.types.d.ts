export interface TemplateSection {
    type: 'recap' | 'nextSteps' | 'aboutUs' | 'caseStudy' | 'pricing' | 'teamBios' | 'custom';
    title: string;
    content?: string;
    libraryRefs?: string[];
}
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
export type TemplateSlug = 'sales-discovery' | 'partnership-meeting' | 'product-demo' | 'technical-discussion' | 'follow-up-call' | 'custom';
//# sourceMappingURL=template.types.d.ts.map