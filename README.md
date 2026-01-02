# SUCF UNEC Website

This is the official website for the Scripture Union Campus Fellowship (SUCF), University of Nigeria Enugu Campus (UNEC).

## Tech Stack
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: React Icons (Fi)

## Getting Started

### 1. Prerequisites
- Node.js installed
- A Supabase project

### 2. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation
```bash
npm install
```

### 4. Running Locally
```bash
npm run dev
```

### 5. Database Schema
If you need to recreate the database tables, use the `supabase_schema.sql` file in the SQL editor of your Supabase dashboard.

## Database Management
This project uses Supabase CLI for database migrations and schema consistency.
To initialize your local environment with the remote project:
```bash
npx supabase link --project-ref your_project_id
```
