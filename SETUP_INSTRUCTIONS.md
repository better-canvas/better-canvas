# Neon Database Setup - Next Steps

Great! The database structure is ready. Here's what you need to do to complete the setup:

## Step 1: Install Dependencies

**Important: This project uses pnpm, not npm.**

Install the packages:

```bash
pnpm install
```

If you don't have pnpm installed, install it first:

```bash
npm install -g pnpm
# or
brew install pnpm
```

## Step 2: Create Your Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up/log in
2. Click "Create Project"
3. Choose a project name: `better-canvas`
4. Select the region closest to you (e.g., US East)
5. Click "Create Project"

## Step 3: Get Your Connection String

After creating the project, you'll see a connection string like:
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Copy this entire string!**

## Step 4: Update .env.local

Open the `.env.local` file and replace the placeholder `DATABASE_URL` with your actual connection string:

```env
DATABASE_URL="postgresql://your-actual-connection-string-here"
```

Keep the rest of the file as is. The `NEXTAUTH_SECRET` has already been generated for you.

## Step 5: Push Schema to Database

Run this command to create all the tables in your Neon database:

```bash
pnpm db:push
```

This will create all the tables defined in `src/db/schema.ts`:
- users
- courses
- enrollments
- assignments
- submissions
- grades
- announcements

## Step 6: Verify Database Connection

Start your development server:

```bash
pnpm dev
```

Then visit: [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db)

You should see a success message confirming the database connection!

## Step 7: (Optional) Seed Test Data

To populate your database with test data, run:

```bash
pnpm db:seed
```

This will create:
- 1 instructor account: `instructor@example.com` / `password123`
- 2 student accounts: `alice@example.com` / `password123`, `bob@example.com` / `password123`
- 1 course: CS 61A
- 2 sample assignments

## File Structure Created

Here's what has been set up:

```
better-canvas/
├── src/
│   └── db/
│       ├── schema.ts      # Database schema (all tables)
│       ├── index.ts       # Database connection
│       └── seed.ts        # Seed script
├── app/
│   └── api/
│       └── test-db/
│           └── route.ts   # Test endpoint
├── drizzle.config.ts      # Drizzle ORM configuration
├── .env.local             # Environment variables (DO NOT COMMIT)
└── package.json           # Updated with new dependencies and scripts
```

## Database Scripts Available

- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate migration files
- `pnpm db:studio` - Open Drizzle Studio (visual database browser)
- `pnpm db:seed` - Seed test data

## Vercel Blob Setup (For File Uploads)

Later, when you're ready to test file uploads:

1. Go to [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
2. Create a new Blob store
3. Copy the token and add it to `.env.local`:
   ```env
   BLOB_READ_WRITE_TOKEN="your-actual-token"
   ```

## Troubleshooting

### "Cannot find module 'drizzle-orm'"
Run `pnpm install` again to ensure all dependencies are installed.

### "Connection refused" or "Database connection failed"
- Make sure your `DATABASE_URL` in `.env.local` is correct
- Check that you've created the Neon project and copied the full connection string
- Ensure the connection string includes `?sslmode=require` at the end

### "relation does not exist"
Run `pnpm db:push` to create the tables in your database.

## What's Next?

Once your database is connected and working:

1. **Authentication**: Set up NextAuth.js for login/signup
2. **API Routes**: Create endpoints for courses, assignments, submissions
3. **UI Components**: Build the dashboard, course pages, etc.

Refer to `CLAUDE.md` for the full implementation plan!

---

Need help? Check the detailed guides:
- `CLAUDE.md` - Full MVP implementation plan
- `NEON_SETUP.md` - Detailed Neon setup guide
- `V0_PROMPTS.md` - UI component generation prompts
