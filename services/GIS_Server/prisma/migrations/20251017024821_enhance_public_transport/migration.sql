/*
  Warnings:

  - Added the required column `updatedAt` to the `public_transports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."public_transports" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "frequency_min" INTEGER,
ADD COLUMN     "operating_hours" TEXT,
ADD COLUMN     "stops_count" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
