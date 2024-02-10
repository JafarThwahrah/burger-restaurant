/*
  Warnings:

  - Added the required column `max_stock_limit` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "max_stock_limit" DOUBLE PRECISION NOT NULL;
