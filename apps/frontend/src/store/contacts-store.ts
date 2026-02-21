import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { contactsApi } from '@/services/api';
import type { Contact, CreateContactDTO, UpdateContactDTO } from '@meeting-followup/shared';

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  // Actions
  fetchContacts: (companyId: string) => Promise<void>;
  createContact: (data: CreateContactDTO) => Promise<Contact>;
  updateContact: (id: string, data: UpdateContactDTO) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useContactsStore = create<ContactsState>()(
  devtools(
    (set) => ({
      contacts: [],
      loading: false,
      error: null,

      fetchContacts: async (companyId) => {
        set({ loading: true, error: null });
        try {
          const contacts = await contactsApi.getByCompany(companyId);
          set({ contacts: Array.isArray(contacts) ? contacts : [], loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch contacts', loading: false });
        }
      },

      createContact: async (data) => {
        set({ loading: true, error: null });
        try {
          const contact = await contactsApi.create(data);
          set((state) => ({
            contacts: [...state.contacts, contact],
            loading: false,
          }));
          return contact;
        } catch (error: any) {
          set({ error: error.message || 'Failed to create contact', loading: false });
          throw error;
        }
      },

      updateContact: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const contact = await contactsApi.update(id, data);
          set((state) => ({
            contacts: state.contacts.map((c) => (c.id === id ? contact : c)),
            loading: false,
          }));
          return contact;
        } catch (error: any) {
          set({ error: error.message || 'Failed to update contact', loading: false });
          throw error;
        }
      },

      deleteContact: async (id) => {
        set({ loading: true, error: null });
        try {
          await contactsApi.delete(id);
          set((state) => ({
            contacts: state.contacts.filter((c) => c.id !== id),
            loading: false,
          }));
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete contact', loading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'contacts-store' }
  )
);
