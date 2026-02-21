import { FollowupStatus, MeetingType } from './enums';
import { Company } from './company.types';
import { Contact } from './company.types';
export interface NextStepItem {
    action: string;
    owner?: string;
    deadline?: string;
    completed: boolean;
}
export interface ContentRefs {
    library?: string[];
    companyContent?: string[];
}
export interface ContentOverride {
    id: string;
    overriddenContent: string;
}
export interface Followup {
    id: string;
    userId: string;
    companyId: string;
    status: FollowupStatus;
    slug?: string | null;
    title: string;
    meetingDate: Date;
    meetingType: MeetingType;
    meetingLocation?: string | null;
    meetingRecap?: string | null;
    meetingNotesUrl?: string | null;
    nextSteps?: NextStepItem[] | null;
    contentRefs?: ContentRefs | null;
    contentOverrides?: ContentOverride[] | null;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date | null;
}
export interface FollowupContact {
    followupId: string;
    contactId: string;
    attended: boolean;
}
export interface CreateFollowupDTO {
    companyId: string;
    title: string;
    meetingDate: string;
    meetingType: MeetingType;
    meetingLocation?: string;
    meetingRecap?: string;
    meetingNotesUrl?: string;
    nextSteps?: NextStepItem[];
    contentRefs?: ContentRefs;
    contentOverrides?: ContentOverride[];
    attendeeContactIds?: string[];
}
export interface UpdateFollowupDTO {
    title?: string;
    meetingDate?: string;
    meetingType?: MeetingType;
    meetingLocation?: string;
    meetingRecap?: string;
    meetingNotesUrl?: string;
    nextSteps?: NextStepItem[];
    contentRefs?: ContentRefs;
    contentOverrides?: ContentOverride[];
    attendeeContactIds?: string[];
}
export interface PublishFollowupDTO {
    slug: string;
}
export interface FollowupWithRelations extends Followup {
    company: Company;
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
//# sourceMappingURL=followup.types.d.ts.map