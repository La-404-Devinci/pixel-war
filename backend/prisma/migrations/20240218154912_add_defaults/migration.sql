/*
  Warnings:

  - The `lastPixelTime` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `isMuted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isBanned` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `placedPixels` INTEGER NOT NULL DEFAULT 0,
    MODIFY `timeAlive` INTEGER NULL,
    DROP COLUMN `lastPixelTime`,
    ADD COLUMN `lastPixelTime` DATETIME(3) NULL,
    MODIFY `lastSentMessageTimes` JSON NULL;
