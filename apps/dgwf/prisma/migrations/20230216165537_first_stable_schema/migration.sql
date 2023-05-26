-- AlterTable
ALTER TABLE `Player` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `handle` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupMember` (
    `playerId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`playerId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupAdmin` (
    `playerId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`playerId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ownerId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameRoomPlayer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `gameRoomId` INTEGER NOT NULL,
    `isAuthed` BOOLEAN NOT NULL DEFAULT false,
    `isGhost` BOOLEAN NOT NULL DEFAULT false,
    `isGuest` BOOLEAN NOT NULL DEFAULT false,
    `guestHandle` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GameRoomPlayer_playerId_gameRoomId_key`(`playerId`, `gameRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `GameType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameTypeOption` (
    `gameTypeId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `validValuesJSON` TEXT NOT NULL,
    `dataDefaultJSON` TEXT NOT NULL,

    PRIMARY KEY (`gameTypeId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameRoomId` INTEGER NOT NULL,
    `gameTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GamePlayer` (
    `gameRoomPlayerId` INTEGER NOT NULL,
    `gameId` INTEGER NOT NULL,
    `playerIdx` INTEGER NOT NULL,
    `teamNum` INTEGER NULL,

    UNIQUE INDEX `GamePlayer_gameId_playerIdx_key`(`gameId`, `playerIdx`),
    PRIMARY KEY (`gameRoomPlayerId`, `gameId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameOptions` (
    `gameId` INTEGER NOT NULL,
    `gameOptionName` VARCHAR(191) NOT NULL,
    `optionDataJSON` TEXT NOT NULL,

    UNIQUE INDEX `GameOptions_gameOptionName_key`(`gameOptionName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turn` (
    `gameId` INTEGER NOT NULL,
    `turnIdx` INTEGER NOT NULL,
    `gameRoomPlayerId` INTEGER NOT NULL,

    UNIQUE INDEX `Turn_gameId_turnIdx_key`(`gameId`, `turnIdx`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DartHit` (
    `gameId` INTEGER NOT NULL,
    `turnIdx` INTEGER NOT NULL,
    `isDouble` BOOLEAN NOT NULL DEFAULT false,
    `isTriple` BOOLEAN NOT NULL DEFAULT false,
    `isMiss` BOOLEAN NOT NULL DEFAULT false,
    `isBounceOut` BOOLEAN NOT NULL DEFAULT false,
    `scoreArea` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`gameId`, `turnIdx`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupMember` ADD CONSTRAINT `GroupMember_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMember` ADD CONSTRAINT `GroupMember_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupAdmin` ADD CONSTRAINT `GroupAdmin_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupAdmin` ADD CONSTRAINT `GroupAdmin_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameRoom` ADD CONSTRAINT `GameRoom_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameRoom` ADD CONSTRAINT `GameRoom_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameRoomPlayer` ADD CONSTRAINT `GameRoomPlayer_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameRoomPlayer` ADD CONSTRAINT `GameRoomPlayer_gameRoomId_fkey` FOREIGN KEY (`gameRoomId`) REFERENCES `GameRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameTypeOption` ADD CONSTRAINT `GameTypeOption_gameTypeId_fkey` FOREIGN KEY (`gameTypeId`) REFERENCES `GameType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_gameRoomId_fkey` FOREIGN KEY (`gameRoomId`) REFERENCES `GameRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_gameTypeId_fkey` FOREIGN KEY (`gameTypeId`) REFERENCES `GameType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GamePlayer` ADD CONSTRAINT `GamePlayer_gameRoomPlayerId_fkey` FOREIGN KEY (`gameRoomPlayerId`) REFERENCES `GameRoomPlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GamePlayer` ADD CONSTRAINT `GamePlayer_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameOptions` ADD CONSTRAINT `GameOptions_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turn` ADD CONSTRAINT `Turn_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turn` ADD CONSTRAINT `Turn_gameRoomPlayerId_fkey` FOREIGN KEY (`gameRoomPlayerId`) REFERENCES `GameRoomPlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DartHit` ADD CONSTRAINT `DartHit_gameId_turnIdx_fkey` FOREIGN KEY (`gameId`, `turnIdx`) REFERENCES `Turn`(`gameId`, `turnIdx`) ON DELETE RESTRICT ON UPDATE CASCADE;
