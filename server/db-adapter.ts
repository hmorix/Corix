/**
 * Database Adapter - Supports both MySQL and Supabase
 * Switch between databases using DATABASE_TYPE environment variable
 * 
 * Usage:
 * DATABASE_TYPE=mysql - Use MySQL (default)
 * DATABASE_TYPE=supabase - Use Supabase PostgreSQL
 */

import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "./_core/env";

export type DatabaseType = "mysql" | "supabase";

let _db: any = null;

export function getDatabaseType(): DatabaseType {
  const envType = process.env.DATABASE_TYPE as DatabaseType;
  if (envType) return envType;
  const url = process.env.DATABASE_URL || "";
  if (url.startsWith("postgres") || url.startsWith("postgresql")) {
    return "supabase";
  }
  return "supabase";
}

/**
 * Get the current database instance
 * Lazily creates connection on first use
 */
export async function getDb() {
  const dbType = getDatabaseType();
  if (!_db && process.env.DATABASE_URL) {
    try {
      if (dbType === "supabase") {
        // Supabase uses PostgreSQL
        const client = postgres(process.env.DATABASE_URL);
        _db = postgresDrizzle(client);
        console.log("[Database] Connected to Supabase PostgreSQL");
      } else {
        // MySQL fallback
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

/**
 * Check if using Supabase
 */
export function isSupabase(): boolean {
  return getDatabaseType() === "supabase";
}

/**
 * Check if using MySQL
 */
export function isMysql(): boolean {
  return getDatabaseType() === "mysql";
}

/**
 * Reset database connection (useful for testing)
 */
export function resetDb() {
  _db = null;
}
