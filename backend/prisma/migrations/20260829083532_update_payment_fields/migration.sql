-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "fee" DOUBLE PRECISION,
ADD COLUMN     "netSettled" DOUBLE PRECISION;
