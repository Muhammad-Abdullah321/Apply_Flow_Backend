-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Setting_userId_key_idx" ON "Setting"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_userId_key_type_key" ON "Setting"("userId", "key", "type");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");
