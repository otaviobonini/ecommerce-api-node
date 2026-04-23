-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PAYED', 'ONGOING', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "Cpf" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productPrice" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Cart" (
    "cartId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartId")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "cartItemId" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cartItemId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "adressId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "paymentLink" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderItemId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "priceAtTime" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_adressId_fkey" FOREIGN KEY ("adressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
