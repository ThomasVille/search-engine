/*
  Warnings:

  - A unique constraint covering the columns `[source]` on the table `ebikes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "bikes_list_pages" TEXT[],
    "bikes_list_selector" TEXT,
    "battery_life_selector" TEXT,
    "torque_selector" TEXT,
    "integrated_lights_selector" TEXT,
    "pictures_selector" TEXT,
    "brand_selector" TEXT,
    "motor_kind_selector" TEXT,
    "front_brakes_selector" TEXT,
    "rear_brakes_selector" TEXT,
    "removable_battery_selector" TEXT,
    "kind_selector" TEXT,
    "price_selector" TEXT,
    "battery_recharge_time_selector" TEXT,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ebikes_source_key" ON "ebikes"("source");
