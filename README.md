# 📌 Smart Bookmark App

A full-stack bookmark manager built with **Next.js (App Router)**, **Supabase**, **Redux Toolkit**, and **Tailwind CSS**.

## 🔗 Live URL

 https://abstrabit-assignment-seven.vercel.app/

> Log in with any Google account to test. Bookmarks are private to each user.

## 📁 GitHub Repo

 https://github.com/ami1manna/abstrabit_assignment

## 🖼️ ScreenShort
<img width="1385" height="683" alt="image" src="https://github.com/user-attachments/assets/883e04b7-1d2b-46f3-855c-db4b5830dd63" />
<img width="1711" height="744" alt="image" src="https://github.com/user-attachments/assets/8e5e0d90-77f9-43f8-b7ca-89ff5c822307" />
 

---

## ✅ Assignment Requirements — How Each Was Met

| Requirement | Implementation |
|---|---|
| Google OAuth only | Supabase Auth with Google provider — no email/password fields exist |
| Add a bookmark (URL + title) | Form dispatches a Redux async thunk → inserts into Supabase |
| Private to each user | Row Level Security (RLS) on the `bookmarks` table — enforced at the database level |
| Real-time without page refresh | Supabase Postgres change feed subscription in the dashboard |
| Delete own bookmarks | Delete thunk + RLS policy ensures users can only delete their own rows |
| Deployed on Vercel | Live URL above — tested with external Google accounts |

---

## 🛠 Tech Stack

- **Next.js 14** — App Router (not Pages Router)
- **Supabase** — Auth, PostgreSQL Database, Realtime
- **Redux Toolkit** — client-side state management
- **Tailwind CSS** + **shadcn/ui** — styling
- **TypeScript** — throughout
- **Vercel** — deployment

---

## 🧠 How It Works

```
Google Login → Supabase Auth
      ↓
Dashboard loads → fetch bookmarks from Supabase (filtered by user_id)
      ↓
User adds/deletes → Redux thunk → Supabase DB
      ↓
Supabase Realtime fires → Redux updates → UI refreshes instantly
```

### Database Schema

```sql
create table public.bookmarks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  url        text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);
```

### Row Level Security

```sql
alter table public.bookmarks enable row level security;

-- Users can only read their own bookmarks
create policy "select own" on public.bookmarks
  for select using (auth.uid() = user_id);

-- Users can only insert their own bookmarks
create policy "insert own" on public.bookmarks
  for insert with check (auth.uid() = user_id);

-- Users can only delete their own bookmarks
create policy "delete own" on public.bookmarks
  for delete using (auth.uid() = user_id);
```

This means even if someone calls the API directly with another user's `user_id`, Supabase will reject it.

---

## ⚠️ Problems I Ran Into & How I Solved Them

### 1. Real-time DELETE events weren't firing in the second tab

**Problem:** Adding a bookmark in Tab A would instantly appear in Tab B — but deleting in Tab A did nothing in Tab B.

**Root cause:** By default, Postgres only sends the primary key (`id`) in DELETE change events — not the full row. My Supabase realtime subscription was filtering by `user_id`, but since `user_id` wasn't included in the DELETE payload, the filter silently failed and the event was dropped.

**Solution:**
```sql
alter table public.bookmarks replica identity full;
```
This tells Postgres to include all columns in DELETE events. After running this, real-time deletes worked correctly across tabs.

---

### 2. "Unsupported provider: provider is not enabled" — Google OAuth error

**Problem:** Clicking "Continue with Google" returned a 400 error from Supabase saying the provider wasn't enabled, even though the frontend code was correct.

**Root cause:** I hadn't properly linked Google Cloud Console credentials to Supabase. The Google provider was toggled on in Supabase, but without a Client ID and Secret it couldn't function.

**Solution:**
1. Created a project in Google Cloud Console
2. Configured the OAuth consent screen
3. Created OAuth credentials (Web Application type)
4. Added `https://your-project.supabase.co/auth/v1/callback` as an authorized redirect URI
5. Pasted the Client ID and Secret into Supabase → Authentication → Providers → Google

---

### 3. Real-time subscription connected but never received any events

**Problem:** The Supabase channel subscribed without errors, but no INSERT or DELETE events ever fired — even after adding a bookmark.

**Root cause:** The `bookmarks` table was not included in the `supabase_realtime` Postgres publication. Without this, Supabase Realtime has no WAL stream to listen to for that table.

**Solution:** Added `public.bookmarks` to the `supabase_realtime` publication under **Supabase → Database → Publications**.

Verified with:
```sql
select * from pg_publication_tables;
-- bookmarks should appear under supabase_realtime
```

---

### 4. Dashboard realtime subscription wasn't cleaning up on unmount

**Problem:** Opening and closing the dashboard multiple times caused duplicate subscriptions to stack up, leading to bookmark entries appearing multiple times.

**Root cause:** The channel cleanup (`supabase.removeChannel`) was placed inside the `initialize()` async function's return, instead of the `useEffect` return. The `useEffect` cleanup never actually ran.

**Solution:** Hoisted the channel variable outside `initialize()` so the `useEffect` cleanup function could reference and remove it properly:

```ts
useEffect(() => {
  let channel: any

  const initialize = async () => {
    // ... auth check and fetch
    channel = supabase.channel("bookmarks-realtime").on(...).subscribe()
    setLoading(false)
  }

  initialize()

  return () => {
    if (channel) supabase.removeChannel(channel)  // ✅ now actually runs
  }
}, [router, dispatch])
```

---

## 🚀 Running Locally

```bash
git clone https://github.com/ami1manna/AbstrabitAssignment.git
cd AbstrabitAssignment
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment Notes

**Vercel environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Supabase → Authentication → URL Configuration:**
- Site URL: `https://abstrabit-rosy.vercel.app`
- Redirect URL: `https://abstrabit-rosy.vercel.app/dashboard`

**Google Cloud Console → OAuth Credentials:**
- Authorized JavaScript origins: `https://abstrabit-rosy.vercel.app`
- Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

---

## 🧪 Testing Real-Time

1. Open two browser tabs and log in with the same Google account
2. Add a bookmark in Tab A → it appears instantly in Tab B
3. Delete a bookmark in Tab A → it disappears instantly in Tab B
4. No page refresh at any point
