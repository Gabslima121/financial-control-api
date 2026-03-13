/*
  Warnings:

  - A unique constraint covering the columns `[personId]` on the table `PersonIncome` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PersonIncome_personId_key" ON "PersonIncome"("personId");
