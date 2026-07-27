// api/index.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";

// server/db.ts
import { eq, or, and } from "drizzle-orm";

// drizzle/schema.ts
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
  pgEnum
} from "drizzle-orm/pg-core";
var roleEnum = pgEnum("role", ["user", "admin"]);
var notificationTypeEnum = pgEnum("notification_type", [
  "follower",
  "message",
  "profile_view",
  "like",
  "comment"
]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  coverImageUrl: text("coverImageUrl"),
  profession: varchar("profession", { length: 100 }),
  skills: json("skills").$type().default([]),
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var portfolioWorks = pgTable("portfolioWorks", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var templates = pgTable("templates", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  previewImageUrl: text("previewImageUrl"),
  category: varchar("category", { length: 100 }),
  htmlContent: text("htmlContent"),
  cssContent: text("cssContent"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  followerId: integer("followerId").notNull(),
  followingId: integer("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("senderId").notNull(),
  recipientId: integer("recipientId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: notificationTypeEnum("type").notNull(),
  fromUserId: integer("fromUserId"),
  message: text("message"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  workId: integer("workId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: text("caption"),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  storyId: integer("storyId").notNull(),
  userId: integer("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/db-adapter.ts
import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var _db = null;
function getDatabaseType() {
  const envType = process.env.DATABASE_TYPE;
  if (envType) return envType;
  const url = process.env.DATABASE_URL || "";
  if (url.startsWith("postgres") || url.startsWith("postgresql")) {
    return "supabase";
  }
  return "supabase";
}
async function getDb() {
  const dbType = getDatabaseType();
  if (!_db && process.env.DATABASE_URL) {
    try {
      if (dbType === "supabase") {
        const client = postgres(process.env.DATABASE_URL);
        _db = postgresDrizzle(client);
        console.log("[Database] Connected to Supabase PostgreSQL");
      } else {
        _db = mysqlDrizzle(process.env.DATABASE_URL);
        console.log("[Database] Connected to MySQL");
      }
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// server/db.ts
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    const dbType = getDatabaseType();
    if (dbType === "supabase") {
      await db.insert(users).values(values).onConflictDoUpdate({
        target: users.openId,
        set: updateSet
      });
    } else {
      await db.insert(users).values(values).onDuplicateKeyUpdate({
        set: updateSet
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getOrCreateProfile(userId) {
  const db = await getDb();
  if (!db) return void 0;
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
    isVerified: false
  };
  await db.insert(profiles).values(newProfile);
  return newProfile;
}
async function getProfileByUserId(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateProfile(userId, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return getProfileByUserId(userId);
}
async function getPortfolioWorks(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioWorks).where(eq(portfolioWorks.userId, userId));
}
async function createPortfolioWork(data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(portfolioWorks).values(data);
  return data;
}
async function followUser(followerId, followingId) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(followers).values({
      followerId,
      followingId
    });
    return true;
  } catch {
    return false;
  }
}
async function unfollowUser(followerId, followingId) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(followers).where(
    and(eq(followers.followerId, followerId), eq(followers.followingId, followingId))
  );
  return true;
}
async function sendMessage(senderId, recipientId, content) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(messages).values({
    senderId,
    recipientId,
    content
  });
  return { senderId, recipientId, content };
}
async function getMessages(userId1, userId2) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(
    or(
      and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
      and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
    )
  );
}
async function createNotification(data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(notifications).values(data);
  return data;
}
async function getNotifications(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId));
}
async function likeWork(userId, workId) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(likes).values({
      userId,
      workId
    });
    return true;
  } catch {
    return false;
  }
}
async function unlikeWork(userId, workId) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.workId, workId)));
  return true;
}
async function createStory(data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(stories).values(data);
  return data;
}
async function getStories(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).limit(limit).offset(offset);
}
async function getUserStories(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).where(eq(stories.userId, userId));
}
async function createComment(data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(comments).values(data);
  return data;
}
async function getStoryComments(storyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.storyId, storyId));
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID || "corix-app",
  cookieSecret: process.env.JWT_SECRET || "corix-jwt-secret-production-key",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/sdk.ts
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    if (ENV.oAuthServerUrl) {
      console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    } else {
      console.log("[OAuth] Running in standalone auth mode");
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        if (ENV.oAuthServerUrl) {
          const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
          await upsertUser({
            openId: userInfo.openId,
            name: userInfo.name || null,
            email: userInfo.email ?? null,
            loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
            lastSignedIn: signedInAt
          });
          user = await getUserByOpenId(userInfo.openId);
        } else {
          await upsertUser({
            openId: session.openId,
            name: session.name || "User",
            email: null,
            loginMethod: "standalone",
            lastSignedIn: signedInAt
          });
          user = await getUserByOpenId(session.openId);
        }
      } catch (error) {
        console.warn("[Auth] OAuth sync bypassed, creating local user session:", error);
        await upsertUser({
          openId: session.openId,
          name: session.name || "User",
          email: null,
          loginMethod: "standalone",
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(session.openId);
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Profile routes
  profile: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      return getOrCreateProfile(ctx.user.id);
    }),
    getById: publicProcedure.input(z2.object({ userId: z2.number() })).query(async ({ input }) => {
      return getProfileByUserId(input.userId);
    }),
    update: protectedProcedure.input(z2.object({
      bio: z2.string().optional(),
      profession: z2.string().optional(),
      skills: z2.array(z2.string()).optional(),
      hourlyRate: z2.string().optional(),
      isAvailableForHire: z2.boolean().optional(),
      youtubeUrl: z2.string().optional(),
      instagramUrl: z2.string().optional(),
      twitterUrl: z2.string().optional(),
      portfolioUrl: z2.string().optional(),
      avatarUrl: z2.string().optional(),
      coverImageUrl: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      return updateProfile(ctx.user.id, input);
    })
  }),
  // Portfolio routes
  portfolio: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getPortfolioWorks(ctx.user.id);
    }),
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      description: z2.string().optional(),
      imageUrl: z2.string(),
      templateId: z2.string().optional(),
      category: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      return createPortfolioWork({
        userId: ctx.user.id,
        ...input
      });
    })
  }),
  // Social routes
  social: router({
    follow: protectedProcedure.input(z2.object({ userId: z2.number() })).mutation(async ({ ctx, input }) => {
      return followUser(ctx.user.id, input.userId);
    }),
    unfollow: protectedProcedure.input(z2.object({ userId: z2.number() })).mutation(async ({ ctx, input }) => {
      return unfollowUser(ctx.user.id, input.userId);
    })
  }),
  // Messaging routes
  messages: router({
    send: protectedProcedure.input(z2.object({ recipientId: z2.number(), content: z2.string() })).mutation(async ({ ctx, input }) => {
      return sendMessage(ctx.user.id, input.recipientId, input.content);
    }),
    getConversation: protectedProcedure.input(z2.object({ userId: z2.number() })).query(async ({ ctx, input }) => {
      return getMessages(ctx.user.id, input.userId);
    })
  }),
  // Notification routes
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getNotifications(ctx.user.id);
    }),
    create: protectedProcedure.input(z2.object({
      type: z2.enum(["follower", "message", "profile_view", "like", "comment"]),
      fromUserId: z2.number().optional(),
      message: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      return createNotification({
        userId: ctx.user.id,
        ...input
      });
    })
  }),
  // Like routes
  likes: router({
    like: protectedProcedure.input(z2.object({ workId: z2.number() })).mutation(async ({ ctx, input }) => {
      return likeWork(ctx.user.id, input.workId);
    }),
    unlike: protectedProcedure.input(z2.object({ workId: z2.number() })).mutation(async ({ ctx, input }) => {
      return unlikeWork(ctx.user.id, input.workId);
    })
  }),
  // Story routes
  stories: router({
    create: protectedProcedure.input(z2.object({
      imageUrl: z2.string(),
      caption: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      return createStory({
        userId: ctx.user.id,
        ...input
      });
    }),
    list: publicProcedure.input(z2.object({
      limit: z2.number().default(20),
      offset: z2.number().default(0)
    })).query(async ({ input }) => {
      return getStories(input.limit, input.offset);
    }),
    getUserStories: publicProcedure.input(z2.object({ userId: z2.number() })).query(async ({ input }) => {
      return getUserStories(input.userId);
    })
  }),
  // Comment routes
  comments: router({
    create: protectedProcedure.input(z2.object({
      storyId: z2.number(),
      content: z2.string()
    })).mutation(async ({ ctx, input }) => {
      return createComment({
        storyId: input.storyId,
        userId: ctx.user.id,
        content: input.content
      });
    }),
    getByStory: publicProcedure.input(z2.object({ storyId: z2.number() })).query(async ({ input }) => {
      return getStoryComments(input.storyId);
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/index.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var index_default = app;
export {
  index_default as default
};
