# Corix Database Setup - MySQL vs Supabase

This guide explains how to switch between MySQL and Supabase PostgreSQL databases.

## 🔄 Quick Switch

Set the `DATABASE_TYPE` environment variable to choose your database:

```bash
# Use MySQL (default)
DATABASE_TYPE=mysql

# Use Supabase PostgreSQL
DATABASE_TYPE=supabase
```

## 📋 Setup Instructions

### Option 1: MySQL (Local Development)

#### Prerequisites
- MySQL 5.7+ or MariaDB installed
- MySQL running locally on port 3306

#### Setup Steps

1. **Create database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE corix;
   EXIT;
   ```

2. **Set environment variables** in `.env.local`:
   ```
   DATABASE_TYPE=mysql
   DATABASE_URL=mysql://root:password@localhost:3306/corix
   ```

3. **Run migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

### Option 2: Supabase (Cloud Database)

#### Prerequisites
- Supabase account (https://supabase.com)
- PostgreSQL database created in Supabase

#### Setup Steps

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Enter project name, password, region
   - Wait for project to initialize

2. **Get Connection String**
   - In Supabase dashboard, go to Settings → Database
   - Copy the "Connection string" (URI format)
   - It should look like: `postgresql://user:password@host:5432/postgres`

3. **Set environment variables** in `.env.local`:
   ```
   DATABASE_TYPE=supabase
   DATABASE_URL=postgresql://user:password@host:5432/postgres
   ```

4. **Run migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 📊 Database Schema

Both MySQL and Supabase use the same Drizzle ORM schema. The following tables are created:

- **users** - User accounts and authentication
- **profiles** - User profile information with verified badge
- **portfolioWorks** - Portfolio pieces and projects
- **stories** - User posts/stories
- **comments** - Comments on stories
- **followers** - Follow relationships
- **messages** - Direct messages
- **notifications** - User notifications
- **templates** - Portfolio templates
- **likes** - Likes on portfolio works

## 🔄 Switching Databases

To switch from MySQL to Supabase (or vice versa):

1. **Update `.env.local`**
   ```bash
   # Change from MySQL to Supabase
   DATABASE_TYPE=supabase
   DATABASE_URL=postgresql://...
   ```

2. **Run migrations on new database**
   ```bash
   pnpm drizzle-kit migrate
   ```

3. **Restart development server**
   ```bash
   pnpm dev
   ```

## 🛠️ Database Adapter Code

The database adapter is located in `server/db-adapter.ts`. It provides:

```typescript
// Get database instance (auto-detects MySQL or Supabase)
const db = await getDb();

// Check current database type
const type = getDatabaseType(); // "mysql" | "supabase"

// Check specific database
if (isSupabase()) { /* ... */ }
if (isMysql()) { /* ... */ }
```

## 📝 Migration Files

Migrations are stored in `drizzle/` directory:

- `0000_clever_junta.sql` - Initial schema
- `0001_red_star_brand.sql` - Portfolio and social features
- `0002_serious_warhawk.sql` - Stories, comments, and verified badges

To generate new migrations:
```bash
pnpm drizzle-kit generate
```

## 🚀 Deployment

### Deploy to Vercel with MySQL
1. Set up MySQL database (e.g., PlanetScale, AWS RDS)
2. In Vercel environment variables:
   ```
   DATABASE_TYPE=mysql
   DATABASE_URL=mysql://user:password@host:3306/corix
   ```

### Deploy to Vercel with Supabase
1. Create Supabase project
2. In Vercel environment variables:
   ```
   DATABASE_TYPE=supabase
   DATABASE_URL=postgresql://user:password@host:5432/postgres
   ```

## 🐛 Troubleshooting

### Connection Error: "ECONNREFUSED"
- **MySQL**: Ensure MySQL is running on localhost:3306
- **Supabase**: Check connection string is correct, verify IP whitelist

### Migration Failed
```bash
# Clear and regenerate migrations
rm -rf drizzle/migrations/*
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Wrong Database Type Detected
- Check `DATABASE_TYPE` environment variable
- Restart development server: `pnpm dev`

### Supabase Connection Timeout
- Add your IP to Supabase IP whitelist
- In Supabase: Settings → Database → Connection pooling → Configure

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Supabase Docs](https://supabase.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 💡 Best Practices

1. **Development**: Use MySQL locally for faster setup
2. **Production**: Use Supabase for managed cloud hosting
3. **Backup**: Always backup your database before migrations
4. **Testing**: Test migrations on a copy of production data first
5. **Monitoring**: Use Supabase dashboard to monitor database performance

---

**Happy coding! 🎉**
