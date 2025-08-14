# Pick Me Pickem

A simple college football pick'em app built with React, Vite and Supabase.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the app locally**
   ```bash
   npm run dev
   ```
3. **Create a Supabase project** and note the URL and anon key.
4. **Configure the database**
   - In the SQL editor run the blocks from `supabase/schema.sql`, `supabase/policies.sql`, and `supabase/seed.sql`.
   - After creating your user, update their role to `admin` in the `profiles` table if needed.
5. **Environment variables**
   - Create a `.env` file with:
     ```bash
     VITE_SUPABASE_URL=your-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Set the same variables in your Netlify project settings.
6. **Deploy to Netlify**
   - The included `netlify.toml` uses `npm run build` and publishes the `dist` folder.
   - SPA routing is configured to redirect all requests to `/index.html`.

## Acceptance Tests

- Sign in with email magic link
- Create seasons and teams as an admin
- Create games and set results
- Submit picks before lock time
- Finalizing a game updates standings in real time
- Standings display correct played, pending and win percentage
- App builds and deploys on Netlify with proper SPA routing
