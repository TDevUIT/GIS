/*
  Warnings:

  - You are about to drop the column `age_group` on the `demographics` table. All the data in the column will be lost.
  - The `income_level` column on the `households` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `housing_type` column on the `households` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `age_min` to the `demographics` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."IncomeLevel" AS ENUM ('Thap', 'TrungBinh', 'Cao');

-- CreateEnum
CREATE TYPE "public"."HousingType" AS ENUM ('NhaRieng', 'ChungCuCaoCap', 'NhaTrongHem', 'NhaTro');

-- AlterTable
ALTER TABLE "public"."demographics" DROP COLUMN "age_group",
ADD COLUMN     "age_max" INTEGER,
ADD COLUMN     "age_min" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."households" DROP COLUMN "income_level",
ADD COLUMN     "income_level" "public"."IncomeLevel",
DROP COLUMN "housing_type",
ADD COLUMN     "housing_type" "public"."HousingType";
