import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';
import { fetchWeather, geocodeCity } from '../services/weather.js';
import { v4 as uuidv4 } from 'uuid'; // Fallback if no newId

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

router.get('/profile', async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !user) {
    // If not found, create a basic record (sync from Clerk)
    const newUser = {
      id: req.user.id,
      email: 'user@clerk.com', // Normally fetched from Clerk
      name: 'StyleSync User',
      profile: {},
      onboardingComplete: false,
    };
    const { data: created, error: insertError } = await supabase.from('users').insert([newUser]).select().single();
    if (insertError) return res.status(500).json({ error: 'Failed to create user' });
    return res.json({ user: created });
  }
  res.json({ user });
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

  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (fetchError || !user) return res.status(404).json({ error: 'User not found' });

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

  if (error) return res.status(500).json({ error: error.message });
  res.json({ user: updatedUser, weather });
});

router.post('/onboarding', async (req, res) => {
  const {
    wardrobeText,
    location,
    occasions,
    mood,
    styles,
    skinTone,
    manualItems,
  } = req.body;

  let newItems = [];

  if (wardrobeText || manualItems?.length) {
    // Wardrobe parsing is deprecated in the new chat-first onboarding flow
    console.log("Wardrobe text parsing is deprecated.");
  }

  if (newItems.length > 0) {
    await supabase.from('wardrobe_items').insert(newItems);
  }

  let weather = null;
  if (location) {
    const geo = await geocodeCity(location);
    if (geo) weather = await fetchWeather(geo.name, geo.lat, geo.lon);
  }

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

  if (error) return res.status(500).json({ error: error.message });
  res.json({ user: updatedUser, weather });
});

export default router;
