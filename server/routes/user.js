import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';
import { fetchWeather, geocodeCity } from '../services/weather.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

// In-memory fallback cache for users if Supabase tables are not yet created
const memoryUsers = {};

function getMemoryUser(userId) {
  if (!memoryUsers[userId]) {
    memoryUsers[userId] = {
      id: userId,
      email: 'user@clerk.com',
      name: 'StyleSync User',
      profile: {
        location: 'Jaipur',
        preferredOccasions: ['casual'],
        preferredMood: 'stylish',
        preferredStyles: ['smart-casual']
      },
      onboardingComplete: false,
    };
  }
  return memoryUsers[userId];
}

router.get('/profile', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      // If not found, create a basic record (sync from Clerk)
      const newUser = getMemoryUser(req.user.id);
      const { data: created, error: insertError } = await supabase.from('users').insert([newUser]).select().single();
      if (insertError) {
        console.warn("DB insert failed, using memory fallback user:", insertError.message);
        return res.json({ user: newUser });
      }
      return res.json({ user: created });
    }
    res.json({ user });
  } catch (err) {
    console.warn("DB profile fetch failed, using memory fallback user:", err.message);
    res.json({ user: getMemoryUser(req.user.id) });
  }
});

router.patch('/profile', async (req, res) => {
  const updates = req.body;
  let weather = null;

  if (updates.location) {
    const geo = await geocodeCity(updates.location);
    if (geo) {
      weather = await fetchWeather(geo.name, geo.lat, geo.lon);
      updates.location = geo.name;
      updates.lastWeather = weather;
    }
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (fetchError || !user) {
      // Fallback update in memory
      const mUser = getMemoryUser(req.user.id);
      mUser.profile = { ...mUser.profile, ...updates };
      if (updates.name !== undefined) mUser.name = updates.name;
      if (updates.onboardingComplete !== undefined) mUser.onboardingComplete = updates.onboardingComplete;
      return res.json({ user: mUser, weather });
    }

    const newProfile = { ...user.profile, ...updates };
    const updateData = { profile: newProfile };
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.onboardingComplete !== undefined) updateData.onboardingComplete = updates.onboardingComplete;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ user: updatedUser, weather });
  } catch (err) {
    console.warn("DB profile patch failed, patching in memory:", err.message);
    const mUser = getMemoryUser(req.user.id);
    mUser.profile = { ...mUser.profile, ...updates };
    if (updates.name !== undefined) mUser.name = updates.name;
    if (updates.onboardingComplete !== undefined) mUser.onboardingComplete = updates.onboardingComplete;
    res.json({ user: mUser, weather });
  }
});

router.post('/onboarding', async (req, res) => {
  const {
    location,
    occasions,
    mood,
    styles,
    skinTone,
  } = req.body;

  let weather = null;
  if (location) {
    const geo = await geocodeCity(location);
    if (geo) weather = await fetchWeather(geo.name, geo.lat, geo.lon);
  }

  try {
    const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single();

    const profileUpdate = {
      preferredOccasions: occasions || [],
      preferredMood: mood,
      preferredStyles: styles || [],
      skinTone: skinTone || null,
      location: weather?.location || location,
      lastWeather: weather,
      favoriteColors: user?.profile?.favoriteColors || [],
      blockedColors: user?.profile?.blockedColors || [],
    };

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ onboardingComplete: true, profile: profileUpdate })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ user: updatedUser, weather });
  } catch (err) {
    console.warn("DB onboarding failed, completing in memory:", err.message);
    const mUser = getMemoryUser(req.user.id);
    mUser.onboardingComplete = true;
    mUser.profile = {
      preferredOccasions: occasions || [],
      preferredMood: mood,
      preferredStyles: styles || [],
      skinTone: skinTone || null,
      location: weather?.location || location,
      lastWeather: weather,
      favoriteColors: [],
      blockedColors: [],
    };
    res.json({ user: mUser, weather });
  }
});

export default router;
