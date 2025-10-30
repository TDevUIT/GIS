/*
  Warnings:

  - A unique constraint covering the columns `[source_url]` on the table `accidents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."accidents" ADD COLUMN     "description" TEXT,
ADD COLUMN     "source_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "accidents_source_url_key" ON "public"."accidents"("source_url");
