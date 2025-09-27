/*
  Warnings:

  - You are about to alter the column `geom` on the `air_qualities` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `districts` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `infrastructures` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `land_uses` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `public_transports` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `terrains` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `traffics` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `urban_plans` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `wards` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - You are about to alter the column `geom` on the `water_qualities` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.

*/
-- DropIndex
DROP INDEX "public"."air_qualities_geom_idx";

-- DropIndex
DROP INDEX "public"."districts_geom_idx";

-- DropIndex
DROP INDEX "public"."infrastructures_geom_idx";

-- DropIndex
DROP INDEX "public"."land_uses_geom_idx";

-- DropIndex
DROP INDEX "public"."public_transports_geom_idx";

-- DropIndex
DROP INDEX "public"."terrains_geom_idx";

-- DropIndex
DROP INDEX "public"."traffics_geom_idx";

-- DropIndex
DROP INDEX "public"."urban_plans_geom_idx";

-- DropIndex
DROP INDEX "public"."wards_geom_idx";

-- DropIndex
DROP INDEX "public"."water_qualities_geom_idx";

-- AlterTable
ALTER TABLE "public"."accidents" ALTER COLUMN "casualties" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."air_qualities" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."districts" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."infrastructures" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."land_uses" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."public_transports" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."terrains" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."traffics" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."urban_plans" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."wards" ALTER COLUMN "geom" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."water_qualities" ALTER COLUMN "geom" SET DATA TYPE TEXT;
