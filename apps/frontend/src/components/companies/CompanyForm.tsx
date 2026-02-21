import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompaniesStore } from '@/store/companies-store';
import type { Company } from '@meeting-followup/shared';

const industryOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Transportation',
  'Energy',
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

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Name must be less than 100 characters'),
  website: z.string().optional().or(z.literal('')).transform((val) => {
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
  industry: z.string().min(1, 'Industry is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')).transform((val) => {
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

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  company?: Company;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CompanyForm({ company, onSuccess, onCancel }: CompanyFormProps) {
  const { createCompany, updateCompany, loading } = useCompaniesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      website: company?.website || '',
      industry: company?.industry || '',
      description: company?.description || '',
      logoUrl: company?.logoUrl || '',
    },
  });

  const logoUrl = watch('logoUrl');

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const formData = {
        name: data.name,
        website: data.website || undefined,
        industry: data.industry || undefined,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
      };

      if (company) {
        await updateCompany(company.id, formData);
      } else {
        await createCompany(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save company:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Company Name <span className="text-red-500">*</span>
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

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          {...register('website')}
          type="text"
          id="website"
          placeholder="www.example.com"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          {...register('industry')}
          id="industry"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select an industry</option>
          {industryOptions.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
        )}
      </div>

      {/* Logo URL */}
      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          {...register('logoUrl')}
          type="text"
          id="logoUrl"
          placeholder="www.example.com/logo.png"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {errors.logoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>
        )}
        {/* Logo preview */}
        {logoUrl && !errors.logoUrl && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <img
              src={logoUrl}
              alt="Logo preview"
              className="h-20 w-20 rounded-lg object-contain border border-gray-200 bg-white p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Brief description of the company..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
          {loading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
        </button>
      </div>
    </form>
  );
}
