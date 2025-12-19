-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFERENCIA', 'CARGO_BANCARIO');

-- CreateTable
CREATE TABLE "UserPaymentData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "iban" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPaymentData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPaymentData_userId_key" ON "UserPaymentData"("userId");

-- CreateIndex
CREATE INDEX "UserPaymentData_paymentMethod_idx" ON "UserPaymentData"("paymentMethod");

-- CreateIndex
CREATE INDEX "UserPaymentData_iban_idx" ON "UserPaymentData"("iban");

-- AddForeignKey
ALTER TABLE "UserPaymentData" ADD CONSTRAINT "UserPaymentData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
