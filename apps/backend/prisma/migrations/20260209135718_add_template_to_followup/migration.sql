-- CreateEnum
CREATE TYPE "TemplateStyle" AS ENUM ('MODERN', 'CONSERVATIVE', 'HYBRID');

-- AlterTable
ALTER TABLE "followups" ADD COLUMN     "template" "TemplateStyle";
