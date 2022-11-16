-- CreateTable
CREATE TABLE "ebikes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "product_name" TEXT,
    "battery_life" DECIMAL,
    "torque" DECIMAL,
    "integrated_lights" BOOLEAN,
    "source" TEXT,
    "pictures" TEXT[],
    "brand" TEXT,
    "motor_kind" TEXT,
    "front_brakes" TEXT,
    "rear_brakes" TEXT,
    "removable_battery" BOOLEAN,
    "kind" TEXT,
    "price" INTEGER,
    "battery_recharge_time" SMALLINT,

    CONSTRAINT "ebikes_pkey" PRIMARY KEY ("id")
);
