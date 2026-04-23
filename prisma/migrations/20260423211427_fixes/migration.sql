/*
  Warnings:

  - The values [PAYED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `adressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `Cpf` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cartId,productId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,productId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'PAID', 'ONGOING', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_adressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "adressId",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ALTER COLUMN "paymentLink" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Cpf";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_productId_key" ON "OrderItem"("orderId", "productId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;
