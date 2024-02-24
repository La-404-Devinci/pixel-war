/*
  Warnings:

  - A unique constraint covering the columns `[devinciEmail]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Account_devinciEmail_key` ON `Account`(`devinciEmail`);
