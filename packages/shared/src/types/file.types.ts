// File attachment types

export interface File {
  id: string;
  followupId: string;
  filename: string;
  fileSize: number; // bytes
  mimeType: string;
  storagePath: string; // Supabase Storage path
  storageUrl: string; // Public CDN URL
  description?: string | null;
  uploadedAt: Date;
}

// API types for file upload
export interface CreateFileDTO {
  followupId: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  storageUrl: string;
  description?: string;
}

export interface UpdateFileDTO {
  description?: string;
}

// File upload response
export interface FileUploadResponse {
  file: File;
  uploadUrl?: string; // Pre-signed URL for direct upload (if using)
}

// Supported file types
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
