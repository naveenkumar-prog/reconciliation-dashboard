/*
  Warnings:

  - You are about to drop the column `explanation` on the `ReconciliationResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ReconciliationResult" DROP COLUMN "explanation",
ADD COLUMN     "notes" TEXT;
