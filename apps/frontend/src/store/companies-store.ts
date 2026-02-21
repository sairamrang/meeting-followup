import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { companiesApi } from '@/services/api';
import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from '@meeting-followup/shared';

interface CompaniesState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
  // Actions
  fetchCompanies: (params?: { page?: number; pageSize?: number; search?: string }) => Promise<void>;
  createCompany: (data: CreateCompanyDTO) => Promise<Company>;
  updateCompany: (id: string, data: UpdateCompanyDTO) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;
  selectCompany: (id: string | null) => void;
  clearError: () => void;
}

export const useCompaniesStore = create<CompaniesState>()(
  devtools(
    persist(
      (set, get) => ({
        companies: [],
        selectedCompany: null,
        loading: false,
        error: null,

        fetchCompanies: async (params) => {
          set({ loading: true, error: null });
          try {
            const data = await companiesApi.getAll(params);
            set({ companies: Array.isArray(data) ? data : data.data || [], loading: false });
          } catch (error: any) {
            set({ error: error.message || 'Failed to fetch companies', loading: false });
          }
        },

        createCompany: async (data) => {
          set({ loading: true, error: null });
          try {
            const company = await companiesApi.create(data);
            set((state) => ({
              companies: [...state.companies, company],
              loading: false,
            }));
            return company;
          } catch (error: any) {
            set({ error: error.message || 'Failed to create company', loading: false });
            throw error;
          }
        },

        updateCompany: async (id, data) => {
          set({ loading: true, error: null });
          try {
            const company = await companiesApi.update(id, data);
            set((state) => ({
              companies: state.companies.map((c) => (c.id === id ? company : c)),
              selectedCompany: state.selectedCompany?.id === id ? company : state.selectedCompany,
              loading: false,
            }));
            return company;
          } catch (error: any) {
            set({ error: error.message || 'Failed to update company', loading: false });
            throw error;
          }
        },

        deleteCompany: async (id) => {
          set({ loading: true, error: null });
          try {
            await companiesApi.delete(id);
            set((state) => ({
              companies: state.companies.filter((c) => c.id !== id),
              selectedCompany: state.selectedCompany?.id === id ? null : state.selectedCompany,
              loading: false,
            }));
          } catch (error: any) {
            set({ error: error.message || 'Failed to delete company', loading: false });
            throw error;
          }
        },

        selectCompany: (id) => {
          const company = id ? get().companies.find((c) => c.id === id) || null : null;
          set({ selectedCompany: company });
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'companies-storage',
        partialize: (state) => ({ selectedCompany: state.selectedCompany }),
      }
    ),
    { name: 'companies-store' }
  )
);
