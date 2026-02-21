// Library and CompanyContent types
import { LibraryType, CompanyContentType } from './enums';

// Library - Your company's reusable content
export interface Library {
  id: string;
  type: LibraryType;
  title: string;
  content: string; // Rich text HTML
  sortOrder?: number | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

// CompanyContent - Prospect company-specific content
export interface CompanyContent {
  id: string;
  companyId?: string | null; // NULL for global content
  type: CompanyContentType;
  title: string;
  content: string; // Rich text HTML
  sortOrder?: number | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

// API types for creating/updating library
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

// API types for creating/updating company content
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

// Grouped content for display
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
