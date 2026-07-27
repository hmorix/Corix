import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
  boolean,
  decimal,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "follower",
  "message",
  "profile_view",
  "like",
  "comment",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User Profile table
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  coverImageUrl: text("coverImageUrl"),
  profession: varchar("profession", { length: 100 }),
  skills: json("skills").$type<string[]>().default([]),
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  isAvailableForHire: boolean("isAvailableForHire").default(false),
  youtubeUrl: text("youtubeUrl"),
  instagramUrl: text("instagramUrl"),
  twitterUrl: text("twitterUrl"),
  portfolioUrl: text("portfolioUrl"),
  followersCount: integer("followersCount").default(0),
  subscribersCount: integer("subscribersCount").default(0),
  viewsCount: integer("viewsCount").default(0),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// Portfolio/Works table
export const portfolioWorks = pgTable("portfolioWorks", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  templateId: varchar("templateId", { length: 100 }),
  category: varchar("category", { length: 100 }),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PortfolioWork = typeof portfolioWorks.$inferSelect;
export type InsertPortfolioWork = typeof portfolioWorks.$inferInsert;

// Templates table
export const templates = pgTable("templates", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  previewImageUrl: text("previewImageUrl"),
  category: varchar("category", { length: 100 }),
  htmlContent: text("htmlContent"),
  cssContent: text("cssContent"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

// Followers/Following table
export const followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  followerId: integer("followerId").notNull(),
  followingId: integer("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Follower = typeof followers.$inferSelect;
export type InsertFollower = typeof followers.$inferInsert;

// Messages/Chat table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("senderId").notNull(),
  recipientId: integer("recipientId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: notificationTypeEnum("type").notNull(),
  fromUserId: integer("fromUserId"),
  message: text("message"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Likes table
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  workId: integer("workId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

// Stories/Posts table
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: text("caption"),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  storyId: integer("storyId").notNull(),
  userId: integer("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;