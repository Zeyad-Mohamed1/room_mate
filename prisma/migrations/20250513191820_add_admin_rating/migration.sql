-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "adminRating" DOUBLE PRECISION,
ADD COLUMN     "hasAdminRating" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AdminRating" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "AdminRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminRating" ADD CONSTRAINT "AdminRating_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminRating" ADD CONSTRAINT "AdminRating_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
