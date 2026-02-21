export interface File {
    id: string;
    followupId: string;
    filename: string;
    fileSize: number;
    mimeType: string;
    storagePath: string;
    storageUrl: string;
    description?: string | null;
    uploadedAt: Date;
}
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
export interface FileUploadResponse {
    file: File;
    uploadUrl?: string;
}
export declare const ALLOWED_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/jpeg", "image/png", "image/gif", "image/webp"];
export declare const MAX_FILE_SIZE: number;
export declare function formatFileSize(bytes: number): string;
//# sourceMappingURL=file.types.d.ts.map