// Company and Contact types

export interface Company {
  id: string;
  name: string;
  website?: string | null;
  industry?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  mainContactId?: string | null; // Primary contact for this company
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

export interface Contact {
  id: string;
  companyId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  linkedinUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API types for creating/updating companies
export interface CreateCompanyDTO {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
  logoUrl?: string;
  mainContactId?: string; // Primary contact for this company
}

export interface UpdateCompanyDTO {
  name?: string;
  website?: string;
  industry?: string;
  description?: string;
  logoUrl?: string;
  mainContactId?: string;
}

// API types for creating/updating contacts
export interface CreateContactDTO {
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  linkedinUrl?: string;
}

export interface UpdateContactDTO {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  linkedinUrl?: string;
}

// Extended types with relations
export interface CompanyWithRelations extends Company {
  contacts?: Contact[];
  followupsCount?: number;
}

export interface ContactWithCompany extends Contact {
  company: Company;
}
