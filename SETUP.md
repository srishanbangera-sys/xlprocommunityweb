# XL Pro Community - Setup Guide

This guide will help you set up the XL Pro Community platform locally and deploy it to Vercel.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git installed

## Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd xl-pro-community
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the project to finish setting up
4. Go to Project Settings > API
5. Copy the following values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

### 4. Configure Environment Variables

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Open `.env.local` and fill in your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   \`\`\`

### 5. Set Up Database

Run the SQL migration scripts in order from the `scripts/sql/` directory:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each script in order:
   - `001_init_supabase.sql`
   - `002_add_image_and_policies.sql`
   - `003_storage_buckets.sql`
   - `004_public_read_policies.sql`
   - `005_admin_write_policies.sql`
   - `006_service_role_write_policies.sql`
   - `007_event_registration_approval.sql`
   - `008_add_payment_fields.sql`

### 6. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

### 1. Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables:
   - Go to Project Settings > Environment Variables
   - Add all the variables from your `.env.local` file
   - Make sure to add them for Production, Preview, and Development environments

5. Click "Deploy"

### 3. Verify Deployment

1. Once deployed, visit your Vercel URL
2. Test the following:
   - Homepage loads correctly
   - Members page displays members
   - Events page displays events
   - Registration form works
   - Admin panel is accessible at `/admin007`

## Troubleshooting

### Error: Missing Supabase environment variables

**Solution:** Ensure all required environment variables are set in your `.env.local` file (local) or Vercel environment variables (production).

### Error: Could not find table in schema cache

**Solution:** Run all SQL migration scripts in the correct order in your Supabase SQL Editor.

### Error: 500 Internal Server Error on API routes

**Solution:** Check that your `SUPABASE_SERVICE_ROLE_KEY` is correctly set and that your database tables exist.

### Storage/Upload Issues

**Solution:** Ensure the storage buckets are created and policies are set up correctly by running scripts `003_storage_buckets.sql` through `006_service_role_write_policies.sql`.

## Admin Access

Access the admin dashboard at `/admin007` using the credentials you set in `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

## Support

For issues or questions, please open an issue on the GitHub repository.
