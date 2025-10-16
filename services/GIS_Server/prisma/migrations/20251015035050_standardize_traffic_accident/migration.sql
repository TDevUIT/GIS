/*
  Warnings:

  - Changed the type of `severity` on the `accidents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AccidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "public"."accidents" DROP COLUMN "severity",
ADD COLUMN     "severity" "public"."AccidentSeverity" NOT NULL;

-- AlterTable
ALTER TABLE "public"."traffics" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "length_km" DOUBLE PRECISION;
