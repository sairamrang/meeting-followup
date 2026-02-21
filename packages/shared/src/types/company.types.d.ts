export interface Company {
    id: string;
    name: string;
    website?: string | null;
    industry?: string | null;
    description?: string | null;
    logoUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
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
export interface CreateCompanyDTO {
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    logoUrl?: string;
}
export interface UpdateCompanyDTO {
    name?: string;
    website?: string;
    industry?: string;
    description?: string;
    logoUrl?: string;
}
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
export interface CompanyWithRelations extends Company {
    contacts?: Contact[];
    followupsCount?: number;
}
export interface ContactWithCompany extends Contact {
    company: Company;
}
//# sourceMappingURL=company.types.d.ts.map