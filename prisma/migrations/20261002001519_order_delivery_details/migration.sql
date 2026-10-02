-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "fullName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';
