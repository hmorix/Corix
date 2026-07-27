# Corix Digital Portfolio Platform - TODO

## Phase 1: Database Schema & Architecture
- [x] Design and implement database schema (users, profiles, portfolios, templates, followers, messages, notifications)
- [x] Create Drizzle migrations for all tables
- [x] Add stories/posts table with comments and likes
- [x] Add verified badge field to profiles
- [ ] Set up Supabase storage configuration for file uploads

## Phase 2: Authentication
- [x] Implement Login page with email/password
- [x] Implement Signup page with form validation
- [x] Implement Forgot Password flow with email reset
- [x] Integrate Google OAuth sign-in
- [x] Set up session management and auth middleware

## Phase 3: Layout & Theme
- [x] Design transcendent visual system (lavender, blush pink, pale mint gradients)
- [x] Build main layout with navigation (top nav + mobile menu)
- [x] Implement responsive design for mobile and desktop
- [x] Create global theme tokens and CSS variables
- [x] Build navigation components (header, sidebar, mobile nav)

## Phase 4: Home Feed
- [x] Create Home feed page with infinite scroll
- [ ] Build portfolio post cards (with images, title, creator info)
- [ ] Implement discovery/recommendation algorithm
- [ ] Add activity feed showing follows, likes, and interactions
- [ ] Implement pagination/infinite scroll with loading states

## Phase 5: Portfolio Creation
- [x] Build template gallery page (Picsart-style grid)
- [x] Create template selection flow
- [ ] Implement photo upload with Supabase storage
- [x] Build chroma key background removal tool
- [ ] Build image crop tool (with canvas/fabric.js)
- [x] Create portfolio editor with template preview
- [x] Save portfolio works to database

## Phase 6: Story/Post Features
- [x] Create stories/posts table and schema
- [x] Build story creation and upload flow
- [x] Implement like/unlike on stories
- [x] Build comments system for stories
- [x] Create story feed with infinite scroll
- [x] Add story views counter

## Phase 7: Profile Page & Verified Badges
- [x] Build user profile page layout
- [x] Display portfolio works gallery
- [x] Show skills and expertise tags
- [x] Display social stats (followers, subscribers, views)
- [x] Add external platform links (YouTube, Instagram, etc.)
- [ ] Build profile edit form
- [ ] Add profile cover image and avatar with Supabase upload
- [x] Add verified badge display
- [ ] Show stories/posts on profile
- [x] Display story comments and engagement

## Phase 8: Hiring/Creator Showcase
- [x] Create hiring profile section on profile page
- [x] Build services/rates display
- [ ] Create portfolio showcase for hiring companies
- [ ] Build portfolio filtering by category/type
- [x] Add "Available for hire" badge and status
- [x] Create search and discovery for hiring profiles

## Phase 9: Social Features
- [ ] Implement Follow/Unfollow system
- [ ] Build Friends list page
- [x] Create Search page with filters (skill, category, profession)
- [ ] Implement Chat/Messaging system
- [ ] Build Chat list and conversation view
- [ ] Create Notifications system (follower, message, profile view)
- [ ] Build Notifications center page

## Phase 10: Polish & Optimization
- [ ] Mobile UI optimization and responsive testing
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Accessibility audit and fixes
- [ ] Error handling and user feedback (toasts, modals)
- [ ] Loading states and skeletons
- [ ] SEO optimization
- [ ] Supabase integration testing
- [ ] Chroma key background removal testing
- [ ] Prepare Vercel deployment config (.vercelignore, env setup)

## Phase 11: Deployment
- [ ] Final testing and QA
- [ ] Set up Supabase project and environment variables
- [ ] Create deployment checkpoint
- [ ] Deploy to Vercel
- [ ] Set up custom domain (if needed)
- [ ] Monitor and fix any production issues

## Additional Features
- [ ] Implement chroma key color detection for background removal
- [ ] Add verified badge system (admin can verify users)
- [ ] Build story/post engagement metrics
- [ ] Implement comment notifications
- [ ] Add story archive/delete functionality
