import { LibraryType, CompanyContentType } from './enums';
export interface Library {
    id: string;
    type: LibraryType;
    title: string;
    content: string;
    sortOrder?: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface CompanyContent {
    id: string;
    companyId?: string | null;
    type: CompanyContentType;
    title: string;
    content: string;
    sortOrder?: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface CreateLibraryDTO {
    type: LibraryType;
    title: string;
    content: string;
    sortOrder?: number;
}
export interface UpdateLibraryDTO {
    type?: LibraryType;
    title?: string;
    content?: string;
    sortOrder?: number;
}
export interface CreateCompanyContentDTO {
    companyId?: string | null;
    type: CompanyContentType;
    title: string;
    content: string;
    sortOrder?: number;
}
export interface UpdateCompanyContentDTO {
    type?: CompanyContentType;
    title?: string;
    content?: string;
    sortOrder?: number;
}
export interface GroupedLibrary {
    [LibraryType.ABOUT_US]: Library[];
    [LibraryType.VALUE_PROP]: Library[];
    [LibraryType.CASE_STUDY]: Library[];
    [LibraryType.TEAM_BIO]: Library[];
    [LibraryType.PRODUCT]: Library[];
    [LibraryType.PRICING]: Library[];
}
export interface GroupedCompanyContent {
    [CompanyContentType.HISTORY]: CompanyContent[];
    [CompanyContentType.LEADERSHIP]: CompanyContent[];
    [CompanyContentType.PRODUCTS]: CompanyContent[];
    [CompanyContentType.NEWS]: CompanyContent[];
    [CompanyContentType.NOTES]: CompanyContent[];
}
//# sourceMappingURL=content.types.d.ts.map