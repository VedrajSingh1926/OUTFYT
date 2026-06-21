const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('stylesync_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data as T;
}

export const api = {
  auth: {
    signup: (body: { email: string; password: string; name?: string }) =>
      request<{ token: string; user: User }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    google: (body: { email: string; name: string; googleId?: string }) =>
      request<{ token: string; user: User }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  user: {
    profile: () => request<{ user: User }>('/user/profile'),
    updateProfile: (body: Partial<UserProfile> & { name?: string; onboardingComplete?: boolean }) =>
      request<{ user: User; weather?: Weather }>('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    completeOnboarding: (body: OnboardingPayload) =>
      request<{ user: User; weather?: Weather }>('/user/onboarding', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  wardrobe: {
    list: () => request<{ items: WardrobeItem[] }>('/wardrobe'),
    preview: (text: string) =>
      request<{ items: ParsedWardrobeItem[]; count: number }>('/wardrobe/preview', {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    confirm: (items: ParsedWardrobeItem[]) =>
      request<{ items: WardrobeItem[]; count: number }>('/wardrobe/confirm', {
        method: 'POST',
        body: JSON.stringify({ items }),
      }),
    mergeDuplicates: () =>
      request<{ merged: number; groups: number }>('/wardrobe/merge-duplicates', { method: 'POST' }),
    addText: (text: string) =>
      request<{ items: WardrobeItem[]; count: number }>('/wardrobe/text', {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    upload: (files: File[]) => {
      const form = new FormData();
      files.forEach((f) => form.append('images', f));
      const token = getToken();
      return fetch(`${API_BASE}/wardrobe/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data as { items: WardrobeItem[]; count: number };
      });
    },
    update: (id: string, body: Partial<WardrobeItem>) =>
      request<{ ok: boolean }>(`/wardrobe/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request<{ ok: boolean }>(`/wardrobe/${id}`, { method: 'DELETE' }),
  },
  outfits: {
    generate: (body: OutfitGenerateParams) =>
      request<{ outfits: Outfit[]; sessionId: string; memory: StyleMemory; weather?: Weather }>(
        '/outfits/generate',
        { method: 'POST', body: JSON.stringify(body) }
      ),
    save: (outfit: Outfit, tags?: string[], collectionId?: string) =>
      request<{ saved: SavedLook }>('/outfits/save', {
        method: 'POST',
        body: JSON.stringify({ outfit, tags, collectionId }),
      }),
    memory: () => request<{ memory: StyleMemory }>('/outfits/memory'),
  },
  chat: {
    sessions: () => request<{ sessions: ChatSession[] }>('/chat/sessions'),
    send: (message: string, sessionId?: string, lastOutfit?: Outfit) =>
      request<{ sessionId: string; messages: ChatMessage[]; memory: StyleMemory }>(
        '/chat/message',
        {
          method: 'POST',
          body: JSON.stringify({ message, sessionId, lastOutfit }),
        }
      ),
  },
  history: {
    list: (q?: string, type?: string) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (type) params.set('type', type);
      const qs = params.toString();
      return request<{ history: HistoryEntry[] }>(`/history${qs ? `?${qs}` : ''}`);
    },
  },
  saved: {
    list: () => request<{ looks: SavedLook[]; collections: Collection[] }>('/saved'),
    createCollection: (name: string, color?: string) =>
      request<{ collection: Collection }>('/saved/collections', {
        method: 'POST',
        body: JSON.stringify({ name, color }),
      }),
    remove: (id: string) =>
      request<{ ok: boolean }>(`/saved/${id}`, { method: 'DELETE' }),
  },
  weather: {
    get: (city: string) => request<{ weather: Weather; geo?: { name: string } }>(`/weather?city=${encodeURIComponent(city)}`),
    coords: (lat: number, lon: number, city?: string) =>
      request<{ weather: Weather }>(`/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city || '')}`),
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  plan?: string;
  onboardingComplete?: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  location?: string;
  lastWeather?: Weather;
  preferredOccasions?: string[];
  preferredMood?: string;
  preferredStyles?: string[];
  favoriteColors?: string[];
  blockedColors?: string[];
  skinTone?: string | null;
  notifications?: boolean;
  wardrobePermissions?: boolean;
}

export interface Weather {
  location: string;
  temp: number;
  unit: string;
  condition: string;
  emoji: string;
  impact: string;
  humidity?: number;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  colors?: string[];
  tags?: string[];
  aiTags?: string[];
  season?: string;
  favorite?: boolean;
  archived?: boolean;
  recentlyUsed?: boolean;
  imageUrl?: string;
  emoji?: string;
  confidence?: number;
  subcategory?: string | null;
  confirmed?: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  reasoning: string;
  confidence: number;
  weatherMatch: number;
  moodMatch: number;
  colorHarmony: number;
  occasion?: string;
  mood?: string;
  emoji?: string;
  gradient?: string;
  versionLabel?: string;
  whyNot?: string;
}

export interface StyleMemory {
  likes: string[];
  dislikes: string[];
  favoriteColors: string[];
  blockedColors: string[];
  preferredStyles: string[];
  preferredMood: string;
  preferredOccasions: string[];
  insights: string[];
  repeatWarning?: string | null;
  wardrobeCount: number;
  location?: string;
  lastWeather?: Weather;
}

export interface SavedLook extends Outfit {
  savedAt?: string;
  tags?: string[];
  collectionId?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  outfits?: Outfit[];
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  type: string;
  createdAt: string;
  outfits?: Outfit[];
  preview?: string;
  context?: Record<string, unknown>;
}

export interface ParsedWardrobeItem {
  name: string;
  category: string;
  color: string;
  colors?: string[];
  tags?: string[];
  aiTags?: string[];
  subcategory?: string | null;
  confidence?: number;
  source?: string;
}

export interface OutfitGenerateParams {
  occasion?: string;
  mood?: string;
  stylePreference?: string;
  notes?: string;
  location?: string;
  weather?: Weather;
  count?: number;
  mode?: 'fresh' | 'variation';
  seed?: number;
}

export interface OnboardingPayload {
  wardrobeText?: string;
  location?: string;
  occasions?: string[];
  mood?: string;
  styles?: string[];
  skinTone?: string | null;
  manualItems?: string[];
}
