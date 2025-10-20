-- CreateEnum
CREATE TYPE "public"."QualityLevel" AS ENUM ('GOOD', 'MODERATE', 'UNHEALTHY', 'HAZARDOUS');

-- AlterTable
ALTER TABLE "public"."air_qualities" ADD COLUMN     "level" "public"."QualityLevel";

-- AlterTable
ALTER TABLE "public"."water_qualities" ADD COLUMN     "level" "public"."QualityLevel";
