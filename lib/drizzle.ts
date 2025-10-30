import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { relations } from 'drizzle-orm'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.development
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') })

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Videos table for Icebreaker Games
export const VideosTable = pgTable(
  'videos',
  {
    id: serial('id').primaryKey(),
    videoId: varchar('video_id', { length: 15 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    channelTitle: varchar('channel_title', { length: 100 }),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    videoUrl: varchar('video_url', { length: 255 }).notNull(),
    durationSeconds: integer('duration_seconds'),
    category: varchar('category', { length: 20 }).default('long'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (videos) => {
    return {
      videoIdIdx: uniqueIndex('video_id_idx').on(videos.videoId),
      slugIdx: uniqueIndex('slug_idx').on(videos.slug),
    }
  }
)

// Tags table
export const TagsTable = pgTable('tags', {
  tagId: serial('tag_id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
})

// Video-Tags relationship table (many-to-many)
export const VideoTagsTable = pgTable(
  'video_tags',
  {
    videoId: integer('video_id')
      .notNull()
      .references(() => VideosTable.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => TagsTable.tagId, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey(table.videoId, table.tagId),
    }
  }
)

// Relations
export const videosRelations = relations(VideosTable, ({ many }) => ({
  videoTags: many(VideoTagsTable),
}))

export const tagsRelations = relations(TagsTable, ({ many }) => ({
  videoTags: many(VideoTagsTable),
}))

export const videoTagsRelations = relations(VideoTagsTable, ({ one }) => ({
  video: one(VideosTable, {
    fields: [VideoTagsTable.videoId],
    references: [VideosTable.id],
  }),
  tag: one(TagsTable, {
    fields: [VideoTagsTable.tagId],
    references: [TagsTable.tagId],
  }),
}))

export type Video = InferSelectModel<typeof VideosTable>
export type NewVideo = InferInsertModel<typeof VideosTable>
export type Tag = InferSelectModel<typeof TagsTable>
export type NewTag = InferInsertModel<typeof TagsTable>
export type VideoTag = InferSelectModel<typeof VideoTagsTable>
export type NewVideoTag = InferInsertModel<typeof VideoTagsTable>

// Connect to Postgres
export const db = drizzle(sql)
