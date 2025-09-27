-- CreateEnum
CREATE TYPE "public"."InfraCategory" AS ENUM ('SCHOOL', 'HOSPITAL', 'PARK', 'MARKET', 'UTILITY', 'ADMINISTRATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SchoolLevel" AS ENUM ('PRESCHOOL', 'PRIMARY', 'SECONDARY', 'HIGH_SCHOOL', 'UNIVERSITY', 'VOCATIONAL');

-- CreateEnum
CREATE TYPE "public"."HospitalType" AS ENUM ('GENERAL', 'SPECIALIZED', 'TRADITIONAL_MEDICINE');

-- CreateEnum
CREATE TYPE "public"."MarketType" AS ENUM ('TRADITIONAL', 'SUPERMARKET', 'MALL');

-- CreateEnum
CREATE TYPE "public"."UtilityType" AS ENUM ('WATER_SUPPLY', 'SEWAGE_TREATMENT', 'WASTE_TREATMENT', 'POWER_PLANT', 'GAS_STATION');

-- CreateEnum
CREATE TYPE "public"."TransportMode" AS ENUM ('BUS', 'METRO', 'BRT', 'WATERWAY');

-- CreateTable
CREATE TABLE "public"."districts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area_km2" DOUBLE PRECISION,
    "density_per_km2" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "districtId" TEXT NOT NULL,
    "geom" TEXT,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."infrastructures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "category" "public"."InfraCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "infrastructures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schools" (
    "id" TEXT NOT NULL,
    "student_capacity" INTEGER,
    "teacher_count" INTEGER,
    "level" "public"."SchoolLevel" NOT NULL,
    "infraId" TEXT NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hospitals" (
    "id" TEXT NOT NULL,
    "bed_capacity" INTEGER,
    "doctor_count" INTEGER,
    "type" "public"."HospitalType" NOT NULL,
    "infraId" TEXT NOT NULL,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parks" (
    "id" TEXT NOT NULL,
    "area" DOUBLE PRECISION,
    "infraId" TEXT NOT NULL,

    CONSTRAINT "parks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."markets" (
    "id" TEXT NOT NULL,
    "stall_count" INTEGER,
    "type" "public"."MarketType" NOT NULL,
    "infraId" TEXT NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."utilities" (
    "id" TEXT NOT NULL,
    "capacity" DOUBLE PRECISION,
    "type" "public"."UtilityType" NOT NULL,
    "infraId" TEXT NOT NULL,

    CONSTRAINT "utilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."populations" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "population_total" INTEGER NOT NULL,
    "households_total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "populations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."households" (
    "id" TEXT NOT NULL,
    "household_size" INTEGER NOT NULL,
    "income_level" TEXT,
    "housing_type" TEXT,
    "populationId" TEXT NOT NULL,

    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."demographics" (
    "id" TEXT NOT NULL,
    "age_group" TEXT NOT NULL,
    "male" INTEGER NOT NULL,
    "female" INTEGER NOT NULL,
    "populationId" TEXT NOT NULL,

    CONSTRAINT "demographics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."terrains" (
    "id" TEXT NOT NULL,
    "elevation" DOUBLE PRECISION,
    "slope" DOUBLE PRECISION,
    "soil_type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "terrains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."air_qualities" (
    "id" TEXT NOT NULL,
    "pm25" DOUBLE PRECISION,
    "co2" DOUBLE PRECISION,
    "no2" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "air_qualities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."water_qualities" (
    "id" TEXT NOT NULL,
    "ph" DOUBLE PRECISION,
    "turbidity" DOUBLE PRECISION,
    "contamination_index" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "water_qualities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."traffics" (
    "id" TEXT NOT NULL,
    "road_name" TEXT NOT NULL,
    "traffic_volume" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "traffics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accidents" (
    "id" TEXT NOT NULL,
    "accident_date" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL,
    "casualties" INTEGER NOT NULL,
    "trafficId" TEXT NOT NULL,

    CONSTRAINT "accidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."public_transports" (
    "id" TEXT NOT NULL,
    "route_name" TEXT NOT NULL,
    "mode" "public"."TransportMode" NOT NULL,
    "capacity" INTEGER,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "public_transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."land_uses" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "area_km2" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "land_uses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."urban_plans" (
    "id" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "zoning_type" TEXT NOT NULL,
    "description" TEXT,
    "issued_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "geom" TEXT,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "urban_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "districts_code_key" ON "public"."districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "wards_code_key" ON "public"."wards"("code");

-- CreateIndex
CREATE UNIQUE INDEX "schools_infraId_key" ON "public"."schools"("infraId");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_infraId_key" ON "public"."hospitals"("infraId");

-- CreateIndex
CREATE UNIQUE INDEX "parks_infraId_key" ON "public"."parks"("infraId");

-- CreateIndex
CREATE UNIQUE INDEX "markets_infraId_key" ON "public"."markets"("infraId");

-- CreateIndex
CREATE UNIQUE INDEX "utilities_infraId_key" ON "public"."utilities"("infraId");

-- CreateIndex
CREATE UNIQUE INDEX "populations_districtId_year_key" ON "public"."populations"("districtId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "land_uses_districtId_type_year_key" ON "public"."land_uses"("districtId", "type", "year");

-- AddForeignKey
ALTER TABLE "public"."wards" ADD CONSTRAINT "wards_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."infrastructures" ADD CONSTRAINT "infrastructures_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_infraId_fkey" FOREIGN KEY ("infraId") REFERENCES "public"."infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hospitals" ADD CONSTRAINT "hospitals_infraId_fkey" FOREIGN KEY ("infraId") REFERENCES "public"."infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parks" ADD CONSTRAINT "parks_infraId_fkey" FOREIGN KEY ("infraId") REFERENCES "public"."infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."markets" ADD CONSTRAINT "markets_infraId_fkey" FOREIGN KEY ("infraId") REFERENCES "public"."infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."utilities" ADD CONSTRAINT "utilities_infraId_fkey" FOREIGN KEY ("infraId") REFERENCES "public"."infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."populations" ADD CONSTRAINT "populations_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."households" ADD CONSTRAINT "households_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "public"."populations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."demographics" ADD CONSTRAINT "demographics_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "public"."populations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."terrains" ADD CONSTRAINT "terrains_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."air_qualities" ADD CONSTRAINT "air_qualities_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."water_qualities" ADD CONSTRAINT "water_qualities_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."traffics" ADD CONSTRAINT "traffics_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accidents" ADD CONSTRAINT "accidents_trafficId_fkey" FOREIGN KEY ("trafficId") REFERENCES "public"."traffics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."public_transports" ADD CONSTRAINT "public_transports_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."land_uses" ADD CONSTRAINT "land_uses_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."urban_plans" ADD CONSTRAINT "urban_plans_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE "public"."districts" ALTER COLUMN "geom" TYPE geometry(MultiPolygon, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."wards" ALTER COLUMN "geom" TYPE geometry(MultiPolygon, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."infrastructures" ALTER COLUMN "geom" TYPE geometry(Point, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."terrains" ALTER COLUMN "geom" TYPE geometry(Polygon, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."air_qualities" ALTER COLUMN "geom" TYPE geometry(Point, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."water_qualities" ALTER COLUMN "geom" TYPE geometry(Point, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."traffics" ALTER COLUMN "geom" TYPE geometry(LineString, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."public_transports" ALTER COLUMN "geom" TYPE geometry(LineString, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."land_uses" ALTER COLUMN "geom" TYPE geometry(MultiPolygon, 4326) USING ST_GeomFromText("geom", 4326);
ALTER TABLE "public"."urban_plans" ALTER COLUMN "geom" TYPE geometry(MultiPolygon, 4326) USING ST_GeomFromText("geom", 4326);

CREATE INDEX "districts_geom_idx" ON "public"."districts" USING GIST ("geom");
CREATE INDEX "wards_geom_idx" ON "public"."wards" USING GIST ("geom");
CREATE INDEX "infrastructures_geom_idx" ON "public"."infrastructures" USING GIST ("geom");
CREATE INDEX "terrains_geom_idx" ON "public"."terrains" USING GIST ("geom");
CREATE INDEX "air_qualities_geom_idx" ON "public"."air_qualities" USING GIST ("geom");
CREATE INDEX "water_qualities_geom_idx" ON "public"."water_qualities" USING GIST ("geom");
CREATE INDEX "traffics_geom_idx" ON "public"."traffics" USING GIST ("geom");
CREATE INDEX "public_transports_geom_idx" ON "public"."public_transports" USING GIST ("geom");
CREATE INDEX "land_uses_geom_idx" ON "public"."land_uses" USING GIST ("geom");
CREATE INDEX "urban_plans_geom_idx" ON "public"."urban_plans" USING GIST ("geom");
