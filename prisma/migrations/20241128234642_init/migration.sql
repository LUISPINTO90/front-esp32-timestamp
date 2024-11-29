-- CreateTable
CREATE TABLE "TimestampMessage" (
    "id" SERIAL NOT NULL,
    "arduinoTimestamp" TIMESTAMP(3) NOT NULL,
    "esp32Timestamp" TIMESTAMP(3) NOT NULL,
    "timeDiff" DOUBLE PRECISION NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimestampMessage_pkey" PRIMARY KEY ("id")
);
