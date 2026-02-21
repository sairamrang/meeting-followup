import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContactsStore } from '@/store/contacts-store';
import type { Contact } from '@meeting-followup/shared';

const roleOptions = [
  'Decision Maker',
  'IT Buyer',
  'Technical Lead',
  'Project Manager',
  'Business Analyst',
  'C-Level Executive',
  'Other',
];

// Helper function to normalize URLs (add https:// if missing)
const normalizeUrl = (url: string): string => {
  if (!url || url.trim() === '') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const contactSchema = z.object({
  name: z.string().min(1, 'Contact name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
  linkedinUrl: z.string().optional().or(z.literal('')).transform((val) => {
    if (!val) return val;
    const normalized = normalizeUrl(val);
    // Validate the normalized URL
    try {
      new URL(normalized);
      return normalized;
    } catch {
      throw new Error('Must be a valid URL');
    }
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact?: Contact;
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ContactForm({ contact, companyId, onSuccess, onCancel }: ContactFormProps) {
  const { createContact, updateContact, loading } = useContactsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      role: contact?.role || '',
      linkedinUrl: contact?.linkedinUrl || '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const formData = {
        companyId,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        role: data.role || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
      };

      if (contact) {
        await updateContact(contact.id, {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          role: data.role || undefined,
          linkedinUrl: data.linkedinUrl || undefined,
        });
      } else {
        await createContact(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="contact@example.com"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          placeholder="+1 (555) 123-4567"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          {...register('role')}
          id="role"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select a role</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* LinkedIn URL */}
      <div>
        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
          LinkedIn Profile
        </label>
        <input
          {...register('linkedinUrl')}
          type="text"
          id="linkedinUrl"
          placeholder="linkedin.com/in/johndoe"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {errors.linkedinUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}
