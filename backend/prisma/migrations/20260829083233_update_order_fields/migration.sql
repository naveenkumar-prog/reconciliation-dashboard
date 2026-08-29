-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "grossAmount" DOUBLE PRECISION;
