import { eq, or, and } from "drizzle-orm";
import { InsertUser, users, profiles, InsertProfile, portfolioWorks, InsertPortfolioWork, followers, messages, notifications, InsertNotification, likes, stories, InsertStory, comments, InsertComment } from "../drizzle/schema";
import { getDb, getDatabaseType } from "./db-adapter";

/**
 * Database Query Helpers
 * Works with both MySQL and Supabase PostgreSQL
 */

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // Handle both MySQL and Supabase
    const dbType = getDatabaseType();
    if (dbType === "supabase") {
      // Supabase uses upsert with onConflict
      await db.insert(users).values(values).onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
    } else {
      // MySQL uses onDuplicateKeyUpdate
      await db.insert(users).values(values).onDuplicateKeyUpdate({
        set: updateSet,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Profile queries
export async function getOrCreateProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const newProfile = {
    userId,
    profession: "Creative Professional",
    bio: "",
    skills: [],
    hourlyRate: "0",
    isAvailableForHire: false,
    avatarUrl: null,
    coverImageUrl: null,
    youtubeUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    portfolioUrl: null,
    followersCount: 0,
    subscribersCount: 0,
    viewsCount: 0,
    isVerified: false,
  };

  await db.insert(profiles).values(newProfile);
  return newProfile;
}

export async function getProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateProfile(userId: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return getProfileByUserId(userId);
}

// Portfolio queries
export async function getPortfolioWorks(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(portfolioWorks).where(eq(portfolioWorks.userId, userId));
}

export async function createPortfolioWork(data: InsertPortfolioWork) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(portfolioWorks).values(data);
  return data;
}

// Social queries
export async function followUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(followers).values({
      followerId,
      followingId,
    });
    return true;
  } catch {
    return false;
  }
}

export async function unfollowUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(followers).where(
    and(eq(followers.followerId, followerId), eq(followers.followingId, followingId))
  );
  return true;
}

// Messaging queries
export async function sendMessage(senderId: number, recipientId: number, content: string) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(messages).values({
    senderId,
    recipientId,
    content,
  });
  return { senderId, recipientId, content };
}

export async function getMessages(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
        and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
      )
    );
}

// Notification queries
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(notifications).values(data);
  return data;
}

export async function getNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(notifications).where(eq(notifications.userId, userId));
}

// Like queries
export async function likeWork(userId: number, workId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(likes).values({
      userId,
      workId,
    });
    return true;
  } catch {
    return false;
  }
}

export async function unlikeWork(userId: number, workId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.workId, workId)));
  return true;
}

// Story queries
export async function createStory(data: InsertStory) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(stories).values(data);
  return data;
}

export async function getStories(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).limit(limit).offset(offset);
}

export async function getUserStories(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).where(eq(stories.userId, userId));
}

// Comment queries
export async function createComment(data: InsertComment) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(comments).values(data);
  return data;
}

export async function getStoryComments(storyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.storyId, storyId));
}
