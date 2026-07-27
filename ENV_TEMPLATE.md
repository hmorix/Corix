# Environment Variables Reference for Vercel & Supabase

Copy these environment variables directly into your **Vercel Project Settings -> Environment Variables** or into your local `.env` file.

```env
# =====================================================================
# CORIX PORTFOLIO PLATFORM - VERCEL ENVIRONMENT VARIABLES
# =====================================================================

# Database Configuration (Supabase PostgreSQL)
DATABASE_TYPE=supabase
DATABASE_URL=postgresql://postgres:196200010%23%24Harsh@db.teztnunfohdwkrcjlcuu.supabase.co:5432/postgres

# Supabase Project API Keys
SUPABASE_URL=https://teztnunfohdwkrcjlcuu.supabase.co
SUPABASE_ANON_KEY=sb_publishable_iYREArnWmBBWFZiOPmtBJg_X4N5oK_5
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlenRudW5mb2hkd2tyY2psY3V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE0MDgzMywiZXhwIjoyMTAwNzE2ODMzfQ.yeOurt3tBettwRpczAU-217YMGnlKzCaSuNk3QXfJQA

# JWT Secret for Auth Sessions
JWT_SECRET=corix-super-secret-jwt-key-2026-production

# App ID & Node Environment
VITE_APP_ID=corix-app
NODE_ENV=production
```

## Variable Descriptions

| Variable Name | Purpose / Value |
|---|---|
| `DATABASE_TYPE` | Set to `supabase` to activate PostgreSQL adapter |
| `DATABASE_URL` | PostgreSQL connection string for Supabase |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key for client operations |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin service role key for backend operations |
| `JWT_SECRET` | Secret key used to sign and verify user auth sessions |
| `VITE_APP_ID` | Identifier for the Corix web application |
| `NODE_ENV` | Environment mode (`production` for Vercel, `development` for local) |
