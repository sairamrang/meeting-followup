-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FIRST_VIEW', 'REVISIT');

-- CreateEnum
CREATE TYPE "ConfirmationType" AS ENUM ('RECAP_ACCURATE', 'RECAP_INACCURATE', 'VALUE_PROP_CLEAR', 'VALUE_PROP_UNCLEAR', 'INTERESTED', 'SCHEDULE_CALL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'SECTION_TIME';
ALTER TYPE "EventType" ADD VALUE 'SCROLL_DEPTH';

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "notify_on_first_view" BOOLEAN NOT NULL DEFAULT true,
    "notify_on_revisit" BOOLEAN NOT NULL DEFAULT true,
    "notify_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "followup_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewer_ip_hash" TEXT,
    "viewer_device_type" "DeviceType",
    "viewer_browser" TEXT,
    "viewer_location_city" TEXT,
    "viewer_location_country" TEXT,
    "viewer_session_id" TEXT,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followup_confirmations" (
    "id" TEXT NOT NULL,
    "followup_id" TEXT NOT NULL,
    "session_id" TEXT,
    "type" "ConfirmationType" NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,

    CONSTRAINT "followup_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- CreateIndex
CREATE INDEX "notifications_followup_id_idx" ON "notifications"("followup_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_sent_at_idx" ON "notifications"("sent_at");

-- CreateIndex
CREATE INDEX "followup_confirmations_followup_id_idx" ON "followup_confirmations"("followup_id");

-- CreateIndex
CREATE INDEX "followup_confirmations_session_id_idx" ON "followup_confirmations"("session_id");

-- CreateIndex
CREATE INDEX "followup_confirmations_type_idx" ON "followup_confirmations"("type");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_confirmations" ADD CONSTRAINT "followup_confirmations_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
