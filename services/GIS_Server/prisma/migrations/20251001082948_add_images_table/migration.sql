-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "infrastructureId" TEXT,
    "accidentId" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "public"."infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "public"."accidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
