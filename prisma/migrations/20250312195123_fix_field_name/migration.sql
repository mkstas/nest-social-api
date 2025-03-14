/*
  Warnings:

  - The primary key for the `articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `articleId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `likes` table. All the data in the column will be lost.
  - Added the required column `article_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `article_id` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_articleId_fkey";

-- AlterTable
ALTER TABLE "articles" DROP CONSTRAINT "articles_pkey",
DROP COLUMN "articleId",
ADD COLUMN     "article_id" SERIAL NOT NULL,
ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("article_id");

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "articleId",
ADD COLUMN     "article_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "articleId",
ADD COLUMN     "article_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("article_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("article_id") ON DELETE RESTRICT ON UPDATE CASCADE;
