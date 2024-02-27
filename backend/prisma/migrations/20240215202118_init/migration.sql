-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devinciEmail` VARCHAR(191) NOT NULL,
    `isMuted` BOOLEAN NOT NULL,
    `isBanned` BOOLEAN NOT NULL,
    `isAdmin` BOOLEAN NOT NULL,
    `placedPixels` INTEGER NOT NULL,
    `timeAlive` INTEGER NOT NULL,
    `lastPixelTime` INTEGER NOT NULL,
    `lastSentMessageTimes` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devinciEmail` VARCHAR(191) NOT NULL,
    `time` INTEGER NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `action` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
