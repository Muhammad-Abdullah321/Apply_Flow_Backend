-- CreateEnum
CREATE TYPE "jobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "applicationStatus" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'GHOSTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobURL" TEXT,
    "location" TEXT,
    "jobType" "jobType" NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "status" "applicationStatus" NOT NULL,
    "minSalary" DECIMAL(65,30),
    "maxSalary" DECIMAL(65,30),
    "currency" TEXT,
    "jobDescription" TEXT,
    "Notes" TEXT,
    "resumeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
