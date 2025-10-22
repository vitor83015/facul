/*
  Warnings:

  - You are about to drop the column `description` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Medicine` table. All the data in the column will be lost.
  - Added the required column `active` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medicine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "active" TEXT NOT NULL,
    "dosage" TEXT,
    "manufacturer" TEXT,
    "batch" TEXT,
    "expiration" TEXT,
    "stock" INTEGER NOT NULL,
    "notes" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Medicine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Medicine" ("createdAt", "dosage", "id", "manufacturer", "name", "stock") SELECT "createdAt", "dosage", "id", "manufacturer", "name", "stock" FROM "Medicine";
DROP TABLE "Medicine";
ALTER TABLE "new_Medicine" RENAME TO "Medicine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
