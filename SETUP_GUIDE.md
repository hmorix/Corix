# Corix Digital Portfolio Platform - Local Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (https://nodejs.org/)
- pnpm (npm install -g pnpm)
- **Choose your database:**
  - **MySQL**: MySQL 5.7+ or MariaDB running locally
  - **Supabase**: Supabase account (https://supabase.com)

### Installation Steps

1. **Set up environment variables**
   Create a `.env` (or `.env.local` for development) file in the root directory:
   ```env
   DATABASE_TYPE=supabase
   DATABASE_URL=postgresql://postgres:196200010%23%24Harsh@db.teztnunfohdwkrcjlcuu.supabase.co:5432/postgres
   SUPABASE_URL=https://teztnunfohdwkrcjlcuu.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_iYREArnWmBBWFZiOPmtBJg_X4N5oK_5
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlenRudW5mb2hkd2tyY2psY3V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE0MDgzMywiZXhwIjoyMTAwNzE2ODMzfQ.yeOurt3tBettwRpczAU-217YMGnlKzCaSuNk3QXfJQA
   JWT_SECRET=corix-super-secret-jwt-key-2026-production
   VITE_APP_ID=corix-app
   ```


4. **Create database and run migrations**
   
   **For MySQL:**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE corix;"
   
   # Run migrations
   pnpm drizzle-kit migrate
   ```
   
   **For Supabase:**
   ```bash
   # Just run migrations (database already exists)
   pnpm drizzle-kit migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The app will be available at: **http://localhost:3000**

## 📁 Project Structure

```
corix/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   ├── db-adapter.ts      # Database abstraction layer
│   └── _core/             # Framework setup
├── drizzle/               # Database schema & migrations
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migrations
├── DATABASE_SETUP.md      # Database configuration guide
├── ENV_TEMPLATE.md        # Environment variables template
└── package.json
```

## 🎨 Key Features

### Authentication
- **Login/Signup**: Email and password authentication
- **Google OAuth**: Social sign-in integration
- **Forgot Password**: Email reset flow

### Portfolio Creation
- **Template Gallery**: Picsart-style grid of templates
- **Photo Upload**: Upload and preview images
- **Background Removal**: Chroma key color detection tool
- **Portfolio Editor**: Create and save portfolio pieces

### Social Features
- **Stories/Posts**: Create, like, and comment on posts
- **Profile Pages**: Showcase work with verified badges
- **Search**: Find creators by skill, category, profession
- **Hiring Profiles**: Display rates and availability

### Design System
- **Transcendent Theme**: Lavender, blush pink, mint gradients
- **Responsive Design**: Mobile-first approach
- **Dark/Light Modes**: Theme switching support

## 🔧 Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Format code
pnpm format

# Type check
pnpm check

# Generate DB migrations
pnpm drizzle-kit generate

# Run DB migrations
pnpm drizzle-kit migrate
```

## 🗄️ Database Schema

### Main Tables
- **users**: User accounts and authentication
- **profiles**: User profile information with verified badge
- **portfolioWorks**: Portfolio pieces and projects
- **stories**: User posts/stories
- **comments**: Comments on stories
- **followers**: Follow relationships
- **messages**: Direct messages
- **notifications**: User notifications
- **templates**: Portfolio templates
- **likes**: Likes on portfolio works

## 🔄 Switching Databases

To switch from MySQL to Supabase (or vice versa):

1. Update `.env.local`:
   ```bash
   DATABASE_TYPE=supabase
   DATABASE_URL=postgresql://user:password@host:5432/postgres
   ```

2. Run migrations:
   ```bash
   pnpm drizzle-kit migrate
   ```

3. Restart dev server:
   ```bash
   pnpm dev
   ```

For detailed setup instructions, see `DATABASE_SETUP.md`.

## 🎯 Testing the Platform

### Test Account Flow
1. Go to http://localhost:3000
2. Click "Sign Up" to create an account
3. Fill in email, password, and profile info
4. Click "Create Portfolio" to start building
5. Choose a template and upload a photo
6. Try the background removal tool
7. Create a story and interact with other users

### Key Pages to Test
- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign up page
- `/home` - Home feed
- `/portfolio/create` - Portfolio creation
- `/profile` - User profile
- `/search` - Search creators
- `/stories` - Story feed

## 🚀 Deployment to Vercel

### With MySQL
1. Set up MySQL database (e.g., PlanetScale, AWS RDS)
2. Push to GitHub
3. Deploy to Vercel with environment variables:
   ```
   DATABASE_TYPE=mysql
   DATABASE_URL=mysql://user:password@host:3306/corix
   ```

### With Supabase
1. Create Supabase project
2. Push to GitHub
3. Deploy to Vercel with environment variables:
   ```
   DATABASE_TYPE=supabase
   DATABASE_URL=postgresql://user:password@host:5432/postgres
   ```

**Steps:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set environment variables
4. Deploy

5. **Set up custom domain**
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain

## 📝 Environment Variables Reference

| Variable | Description |
|----------|-------------|
| DATABASE_TYPE | `mysql` or `supabase` |
| DATABASE_URL | MySQL or PostgreSQL connection string |
| JWT_SECRET | Secret for session signing |
| VITE_APP_ID | OAuth app ID |
| OAUTH_SERVER_URL | OAuth provider URL |
| OWNER_OPEN_ID | Owner's unique ID |
| OWNER_NAME | Owner's display name |

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database connection error
- **MySQL**: Check DATABASE_URL is correct, ensure MySQL is running
- **Supabase**: Verify connection string, check IP whitelist

### Migrations failed
```bash
# Clear and regenerate migrations
rm -rf drizzle/migrations/*
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Express.js](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc)

## 💡 Next Steps

1. Set up file storage (Supabase Storage or AWS S3)
2. Implement real-time notifications
3. Add payment processing with Stripe
4. Build mobile app with React Native
5. Set up CI/CD pipeline

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review `DATABASE_SETUP.md` for database-specific help
3. Review the code comments
4. Check browser console for errors
5. Review server logs in `.manus-logs/`

---

**Happy coding! 🎉**
