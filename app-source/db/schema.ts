import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const posts = sqliteTable("chemistry_posts", {
 id: text("id").primaryKey(), ownerId: text("owner_id").notNull(), author: text("author").notNull(),
 category: text("category").notNull(), caseId: text("case_id").notNull().default(""),
 title: text("title").notNull(), observed: text("observed").notNull(), question: text("question").notNull(),
 hypothesis: text("hypothesis").notNull().default(""), status: text("status").notNull().default("open"),
 createdAt: integer("created_at").notNull(), deletedAt: integer("deleted_at")
}, table=>[index("chemistry_posts_created_idx").on(table.createdAt),index("chemistry_posts_owner_idx").on(table.ownerId)]);
export const replies = sqliteTable("chemistry_replies", {
 id: text("id").primaryKey(), postId: text("post_id").notNull().references(()=>posts.id),
 ownerId: text("owner_id").notNull(), author: text("author").notNull(), body: text("body").notNull(),
 createdAt: integer("created_at").notNull(), deletedAt: integer("deleted_at")
}, table=>[index("chemistry_replies_post_idx").on(table.postId),index("chemistry_replies_owner_idx").on(table.ownerId)]);

