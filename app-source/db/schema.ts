import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
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
export const dashboardMembers = sqliteTable("dashboard_members", {
 id:text("id").primaryKey(), userId:text("user_id").notNull(), alias:text("alias").notNull(),
 focus:text("focus").notNull().default("Chemistry"), role:text("role").notNull().default("member"),
 status:text("status").notNull().default("pending"), createdAt:integer("created_at").notNull(), updatedAt:integer("updated_at").notNull()
},t=>[uniqueIndex("dashboard_member_user_idx").on(t.userId)]);
export const dashboardItems = sqliteTable("dashboard_items", {
 id:text("id").primaryKey(), kind:text("kind").notNull(), data:text("data").notNull(),
 version:integer("version").notNull().default(1), updatedAt:integer("updated_at").notNull(),
 updatedBy:text("updated_by").references(()=>dashboardMembers.id), mutationId:text("mutation_id").notNull()
},t=>[index("dashboard_item_kind_idx").on(t.kind)]);
export const dashboardActivity = sqliteTable("dashboard_activity", {
 id:text("id").primaryKey(), kind:text("kind").notNull(), entityId:text("entity_id").notNull(),
 actorId:text("actor_id").references(()=>dashboardMembers.id), actorAlias:text("actor_alias").notNull(),
 summary:text("summary").notNull(), beforeData:text("before_data").notNull(), afterData:text("after_data").notNull(), createdAt:integer("created_at").notNull()
},t=>[index("dashboard_activity_time_idx").on(t.createdAt)]);

