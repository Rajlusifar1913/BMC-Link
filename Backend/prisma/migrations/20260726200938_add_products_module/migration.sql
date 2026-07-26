-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_products" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "file_url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "slug" TEXT NOT NULL,
    "category_id" TEXT,
    "visibility" "ProductVisibility" NOT NULL DEFAULT 'PUBLIC',
    "preview_url" TEXT,
    "download_limit" INTEGER,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tag_map" (
    "product_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "product_tag_map_pkey" PRIMARY KEY ("product_id","tag_id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "buyer_name" TEXT,
    "buyer_email" TEXT,
    "buyer_id" TEXT,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "license_key" TEXT,
    "expires_at" TIMESTAMP(3),
    "purchased_at" TIMESTAMP(3),

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_name_key" ON "product_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_name_key" ON "product_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_slug_key" ON "product_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "digital_products_slug_key" ON "digital_products"("slug");

-- CreateIndex
CREATE INDEX "digital_products_creator_id_idx" ON "digital_products"("creator_id");

-- CreateIndex
CREATE INDEX "digital_products_category_id_idx" ON "digital_products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_payment_id_key" ON "purchases"("payment_id");

-- CreateIndex
CREATE INDEX "purchases_product_id_idx" ON "purchases"("product_id");

-- CreateIndex
CREATE INDEX "purchases_buyer_id_idx" ON "purchases"("buyer_id");

-- AddForeignKey
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "digital_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "product_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "digital_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
