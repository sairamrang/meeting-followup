-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('SALES', 'PARTNERSHIP', 'DEMO', 'DISCOVERY', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "LibraryType" AS ENUM ('ABOUT_US', 'VALUE_PROP', 'CASE_STUDY', 'TEAM_BIO', 'PRODUCT', 'PRICING');

-- CreateEnum
CREATE TYPE "CompanyContentType" AS ENUM ('HISTORY', 'LEADERSHIP', 'PRODUCTS', 'NEWS', 'NOTES');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PAGE_VIEW', 'SECTION_VIEW', 'FILE_DOWNLOAD', 'LINK_CLICK', 'COPY_EMAIL', 'COPY_PHONE');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('MOBILE', 'TABLET', 'DESKTOP');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "description" TEXT,
    "logo_url" TEXT,
    "main_contact_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT,
    "linkedin_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followups" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sender_company_id" TEXT NOT NULL,
    "receiver_company_id" TEXT NOT NULL,
    "sender_id" TEXT,
    "receiver_id" TEXT,
    "company_id" TEXT NOT NULL,
    "status" "FollowupStatus" NOT NULL DEFAULT 'DRAFT',
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "meeting_date" DATE NOT NULL,
    "meeting_type" "MeetingType" NOT NULL,
    "meeting_location" TEXT,
    "product" TEXT,
    "meeting_recap" TEXT,
    "meeting_notes_url" TEXT,
    "video_recording_url" TEXT,
    "next_steps" JSONB,
    "content_refs" JSONB,
    "content_overrides" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "followups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followup_contacts" (
    "followup_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "followup_contacts_pkey" PRIMARY KEY ("followup_id","contact_id")
);

-- CreateTable
CREATE TABLE "company_content" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "type" "CompanyContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sort_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "company_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library" (
    "id" TEXT NOT NULL,
    "type" "LibraryType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sort_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "structure" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "followup_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "storage_url" TEXT NOT NULL,
    "description" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "followup_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "event_type" "EventType" NOT NULL,
    "event_data" JSONB,
    "device_type" "DeviceType" NOT NULL,
    "browser" TEXT,
    "location_city" TEXT,
    "location_country" TEXT,
    "ip_hash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_sessions" (
    "id" TEXT NOT NULL,
    "followup_id" TEXT NOT NULL,
    "session_start" TIMESTAMP(3) NOT NULL,
    "session_end" TIMESTAMP(3),
    "page_duration" INTEGER,
    "device_type" "DeviceType" NOT NULL,
    "browser" TEXT,
    "location_city" TEXT,
    "location_country" TEXT,

    CONSTRAINT "analytics_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_created_by_idx" ON "companies"("created_by");

-- CreateIndex
CREATE INDEX "companies_main_contact_id_idx" ON "companies"("main_contact_id");

-- CreateIndex
CREATE INDEX "contacts_company_id_idx" ON "contacts"("company_id");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "followups_slug_key" ON "followups"("slug");

-- CreateIndex
CREATE INDEX "followups_user_id_idx" ON "followups"("user_id");

-- CreateIndex
CREATE INDEX "followups_company_id_idx" ON "followups"("company_id");

-- CreateIndex
CREATE INDEX "followups_sender_company_id_idx" ON "followups"("sender_company_id");

-- CreateIndex
CREATE INDEX "followups_receiver_company_id_idx" ON "followups"("receiver_company_id");

-- CreateIndex
CREATE INDEX "followups_sender_id_idx" ON "followups"("sender_id");

-- CreateIndex
CREATE INDEX "followups_receiver_id_idx" ON "followups"("receiver_id");

-- CreateIndex
CREATE INDEX "followups_status_idx" ON "followups"("status");

-- CreateIndex
CREATE INDEX "followups_slug_idx" ON "followups"("slug");

-- CreateIndex
CREATE INDEX "company_content_company_id_idx" ON "company_content"("company_id");

-- CreateIndex
CREATE INDEX "company_content_type_idx" ON "company_content"("type");

-- CreateIndex
CREATE INDEX "library_type_idx" ON "library"("type");

-- CreateIndex
CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");

-- CreateIndex
CREATE INDEX "files_followup_id_idx" ON "files"("followup_id");

-- CreateIndex
CREATE INDEX "analytics_events_followup_id_timestamp_idx" ON "analytics_events"("followup_id", "timestamp");

-- CreateIndex
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events"("session_id");

-- CreateIndex
CREATE INDEX "analytics_sessions_followup_id_idx" ON "analytics_sessions"("followup_id");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_sender_company_id_fkey" FOREIGN KEY ("sender_company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_receiver_company_id_fkey" FOREIGN KEY ("receiver_company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_contacts" ADD CONSTRAINT "followup_contacts_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_contacts" ADD CONSTRAINT "followup_contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_content" ADD CONSTRAINT "company_content_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_sessions" ADD CONSTRAINT "analytics_sessions_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
