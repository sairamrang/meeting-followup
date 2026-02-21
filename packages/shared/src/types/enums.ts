// Shared enums matching Prisma schema enums

export enum FollowupStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum MeetingType {
  SALES = 'SALES',
  PARTNERSHIP = 'PARTNERSHIP',
  DEMO = 'DEMO',
  DISCOVERY = 'DISCOVERY',
  TECHNICAL = 'TECHNICAL',
  OTHER = 'OTHER',
}

export enum LibraryType {
  ABOUT_US = 'ABOUT_US',
  VALUE_PROP = 'VALUE_PROP',
  CASE_STUDY = 'CASE_STUDY',
  TEAM_BIO = 'TEAM_BIO',
  PRODUCT = 'PRODUCT',
  PRICING = 'PRICING',
}

export enum CompanyContentType {
  HISTORY = 'HISTORY',
  LEADERSHIP = 'LEADERSHIP',
  PRODUCTS = 'PRODUCTS',
  NEWS = 'NEWS',
  NOTES = 'NOTES',
}

export enum EventType {
  PAGE_VIEW = 'PAGE_VIEW',
  SECTION_VIEW = 'SECTION_VIEW',
  SECTION_TIME = 'SECTION_TIME',
  SCROLL_DEPTH = 'SCROLL_DEPTH',
  FILE_DOWNLOAD = 'FILE_DOWNLOAD',
  LINK_CLICK = 'LINK_CLICK',
  COPY_EMAIL = 'COPY_EMAIL',
  COPY_PHONE = 'COPY_PHONE',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP',
}

export enum TemplateStyle {
  MODERN = 'MODERN',         // Bold, colorful, editorial
  CONSERVATIVE = 'CONSERVATIVE',  // Clean, professional, corporate
  HYBRID = 'HYBRID',          // Balanced, modern + professional
}

export enum NotificationType {
  FIRST_VIEW = 'FIRST_VIEW',
  REVISIT = 'REVISIT',
}
