-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('WEBSITE', 'YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'GITHUB', 'CUSTOM');

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "icon" TEXT,
    "thumbnail" TEXT,
    "position" INTEGER,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_clicks" (
    "id" TEXT NOT NULL,
    "link_id" TEXT NOT NULL,
    "visitor_ip" TEXT,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_views" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "viewer_ip" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_analytics" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "total_profile_views" INTEGER NOT NULL DEFAULT 0,
    "total_link_clicks" INTEGER NOT NULL DEFAULT 0,
    "total_donations" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_sales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "links_creator_id_idx" ON "links"("creator_id");

-- CreateIndex
CREATE INDEX "links_position_idx" ON "links"("position");

-- CreateIndex
CREATE INDEX "link_clicks_link_id_idx" ON "link_clicks"("link_id");

-- CreateIndex
CREATE INDEX "profile_views_creator_id_idx" ON "profile_views"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "creator_analytics_creator_id_key" ON "creator_analytics"("creator_id");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_clicks" ADD CONSTRAINT "link_clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_analytics" ADD CONSTRAINT "creator_analytics_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
