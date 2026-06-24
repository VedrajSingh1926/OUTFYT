-- SQL Schema for OUTFYT Database Setup
-- Run these statements in your Supabase SQL Editor to initialize the database tables.

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT,
    name TEXT,
    profile JSONB DEFAULT '{}'::jsonb,
    "onboardingComplete" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Wardrobe Items Table
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    colors TEXT[],
    tags TEXT[],
    "aiTags" TEXT[],
    season TEXT,
    favorite BOOLEAN DEFAULT false,
    archived BOOLEAN DEFAULT false,
    "recentlyUsed" BOOLEAN DEFAULT false,
    "imageUrl" TEXT,
    emoji TEXT,
    confidence NUMERIC,
    subcategory TEXT,
    confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#7C6CFF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Saved Looks Table
CREATE TABLE IF NOT EXISTS public.saved_looks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    items TEXT[],
    "itemIds" TEXT[],
    reasoning TEXT,
    confidence NUMERIC,
    "weatherMatch" NUMERIC,
    "moodMatch" NUMERIC,
    "colorHarmony" NUMERIC,
    occasion TEXT,
    mood TEXT,
    emoji TEXT,
    gradient TEXT,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    tags TEXT[],
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Outfit History Table
CREATE TABLE IF NOT EXISTS public.outfit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'outfit_session', 'saved', 'chat'
    outfits JSONB, -- For session type
    outfit JSONB, -- For saved type
    context JSONB, -- For generation context
    session_id UUID, -- For chat mapping
    preview TEXT, -- For chat preview
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS and add basic select/insert policies (or disable to allow all public traffic for simple config)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_looks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions DISABLE ROW LEVEL SECURITY;
