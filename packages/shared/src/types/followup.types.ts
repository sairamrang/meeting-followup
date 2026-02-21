// Followup and FollowupContact types
import { FollowupStatus, MeetingType, TemplateStyle } from './enums';
import { Company } from './company.types';
import { Contact } from './company.types';

// Next step item structure
export interface NextStepItem {
  action: string;
  owner?: string;
  deadline?: string; // ISO date string
  completed: boolean;
}

// Content references structure
export interface ContentRefs {
  library?: string[]; // Array of Library IDs
  companyContent?: string[]; // Array of CompanyContent IDs
}

// Content overrides structure
export interface ContentOverride {
  id: string; // Library or CompanyContent ID
  overriddenContent: string; // HTML content
}

export interface Followup {
  id: string;
  userId: string; // Clerk user ID (creator)

  // Sender & Receiver Companies
  senderCompanyId: string; // User's company
  receiverCompanyId: string; // Prospect company
  companyId: string; // DEPRECATED: Legacy field (maps to receiverCompanyId)

  // Main Participants
  senderId?: string | null; // Main contact from sender company
  receiverId?: string | null; // Main contact from receiver company

  status: FollowupStatus;
  slug?: string | null;
  template?: TemplateStyle | null; // Design template for public view

  // Meeting details
  title: string;
  meetingDate: Date;
  meetingType: MeetingType;
  meetingLocation?: string | null;
  product?: string | null; // Product/solution discussed

  // Content
  meetingRecap?: string | null; // Rich text HTML or plain text
  valueProposition?: string | null; // Rich text HTML describing the value proposition
  meetingNotesUrl?: string | null; // External link (Google Docs, AI notes)
  videoRecordingUrl?: string | null; // Link to meeting recording
  nextSteps?: NextStepItem[] | null;

  // Company content selection
  contentRefs?: ContentRefs | null;
  contentOverrides?: ContentOverride[] | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

export interface FollowupContact {
  followupId: string;
  contactId: string;
  attended: boolean;
}

// API types for creating/updating followups
export interface CreateFollowupDTO {
  senderCompanyId: string; // User's company
  receiverCompanyId: string; // Prospect company
  senderId?: string; // Main contact from sender company
  receiverId?: string; // Main contact from receiver company
  title: string;
  meetingDate: string; // ISO date string
  meetingType: MeetingType;
  meetingLocation?: string;
  product?: string; // Product/solution discussed
  meetingRecap?: string;
  valueProposition?: string;
  meetingNotesUrl?: string;
  videoRecordingUrl?: string; // Link to meeting recording
  nextSteps?: NextStepItem[];
  contentRefs?: ContentRefs;
  contentOverrides?: ContentOverride[];
  attendeeContactIds?: string[]; // Contact IDs to link
}

export interface UpdateFollowupDTO {
  senderCompanyId?: string;
  receiverCompanyId?: string;
  senderId?: string;
  receiverId?: string;
  title?: string;
  meetingDate?: string;
  meetingType?: MeetingType;
  meetingLocation?: string;
  product?: string;
  meetingRecap?: string;
  valueProposition?: string;
  meetingNotesUrl?: string;
  videoRecordingUrl?: string;
  nextSteps?: NextStepItem[];
  contentRefs?: ContentRefs;
  contentOverrides?: ContentOverride[];
  attendeeContactIds?: string[];
  template?: TemplateStyle; // Allow changing template after creation
}

export interface PublishFollowupDTO {
  slug: string; // User-provided or auto-generated slug
  template?: TemplateStyle; // Design template choice (defaults to MODERN)
}

// Extended types with relations
export interface FollowupWithRelations extends Followup {
  company: Company; // DEPRECATED: Legacy field (maps to receiverCompany)
  senderCompany: Company; // User's company
  receiverCompany: Company; // Prospect company
  sender?: Contact | null; // Main contact from sender company
  receiver?: Contact | null; // Main contact from receiver company
  followupContacts?: Array<{
    contact: Contact;
    attended: boolean;
  }>;
  filesCount?: number;
  viewsCount?: number;
}

export interface FollowupSummary {
  id: string;
  title: string;
  companyName: string;
  meetingDate: Date;
  status: FollowupStatus;
  slug?: string | null;
  viewsCount: number;
  lastViewedAt?: Date | null;
}
