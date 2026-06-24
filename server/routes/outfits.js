import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';
import { generateOutfits, buildStyleMemory } from '../services/aiEngine.js';
import { fetchWeather, geocodeCity } from '../services/weather.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

async function getUserContext(userId, body) {
  let user = null;
  let wardrobe = [];
  let history = [];
  
  try {
    const { data: userData } = await supabase.from('users').select('*').eq('id', userId).single();
    user = userData;
    const { data: wardrobeItems } = await supabase.from('wardrobe_items').select('*').eq('user_id', userId).eq('archived', false);
    wardrobe = wardrobeItems || [];
    const { data: historyItems } = await supabase.from('outfit_history').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    history = historyItems || [];
  } catch (err) {
    console.warn("DB fetch failed in getUserContext, using empty defaults:", err.message);
  }

  const memory = buildStyleMemory(userId, wardrobe, history, user?.profile);

  return {
    user,
    wardrobe,
    history,
    memory,
    context: {
      occasion: body.occasion || memory.preferredOccasions?.[0] || 'Casual',
      mood: body.mood || memory.preferredMood || 'stylish',
      stylePreference: body.stylePreference || memory.preferredStyles?.[0] || 'smart-casual',
      notes: body.notes,
      location: body.location || memory.location || user?.profile?.location,
      weather: body.weather || memory.lastWeather,
    },
  };
}

router.post('/generate', async (req, res) => {
  let { user, wardrobe, memory, context } = await getUserContext(req.user.id, req.body);
  const { currentLocation, destinationLocation, useDestination } = req.body;

  let activeLocation = currentLocation || context.location;
  let activeWeather = context.weather;

  if (useDestination && destinationLocation) {
    const destGeo = await geocodeCity(destinationLocation);
    if (destGeo) {
      activeLocation = destGeo.name;
      activeWeather = await fetchWeather(destGeo.name, destGeo.lat, destGeo.lon);
      context.isDestinationActive = true;
      context.destinationName = destGeo.name;
    }
  } else if (activeLocation) {
    const geo = await geocodeCity(activeLocation);
    if (geo) {
      activeLocation = geo.name;
      activeWeather = await fetchWeather(geo.name, geo.lat, geo.lon);
    }
  }

  context.location = activeLocation;
  context.weather = activeWeather;

  // Persist user location updates
  if (user) {
    const homeLoc = currentLocation || user.profile?.location;
    const newProfile = { 
      ...user.profile, 
      location: homeLoc,
      ...(activeWeather && !useDestination ? { lastWeather: activeWeather } : {})
    };
    try {
      await supabase.from('users').update({ profile: newProfile }).eq('id', req.user.id);
    } catch (err) {
      console.warn("DB update failed in outfits generate:", err.message);
    }
  }

  const mode = req.body.mode === 'variation' ? 'variation' : 'fresh';
  const seed = req.body.seed || Date.now();
  
  // Use AI engine
  const outfits = await generateOutfits(wardrobe, context, req.body.count || 3, { seed, mode });
  const sessionId = crypto.randomUUID();

  // Save history
  const historyRecord = {
    id: sessionId,
    user_id: req.user.id,
    type: 'outfit_session',
    outfits,
    context,
    created_at: new Date().toISOString(),
  };
  try {
    await supabase.from('outfit_history').insert([historyRecord]);
  } catch (err) {
    console.warn("DB insert failed in outfits generate:", err.message);
  }

  res.json({ outfits, sessionId, memory, weather: context.weather });
});

router.post('/save', async (req, res) => {
  const { outfit, collectionId, tags } = req.body;
  const saved = {
    id: crypto.randomUUID(),
    user_id: req.user.id,
    ...outfit,
    collection_id: collectionId || null,
    tags: tags || [],
    saved_at: new Date().toISOString(),
  };

  try {
    await supabase.from('saved_looks').insert([saved]);
  } catch (err) {
    console.warn("DB insert failed in save look:", err.message);
  }
  
  const historyRecord = {
    id: crypto.randomUUID(),
    user_id: req.user.id,
    type: 'saved',
    outfit: saved,
    created_at: new Date().toISOString(),
  };
  try {
    await supabase.from('outfit_history').insert([historyRecord]);
  } catch (err) {
    console.warn("DB insert failed in save look history:", err.message);
  }

  res.json({ saved });
});

router.get('/memory', async (req, res) => {
  let user = null;
  let wardrobe = [];
  let history = [];
  try {
    const { data: userData } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    user = userData;
    const { data: wardrobeItems } = await supabase.from('wardrobe_items').select('*').eq('user_id', req.user.id);
    wardrobe = wardrobeItems || [];
    const { data: historyItems } = await supabase.from('outfit_history').select('*').eq('user_id', req.user.id);
    history = historyItems || [];
  } catch (err) {
    console.warn("DB fetch failed in memory route:", err.message);
  }

  const memory = buildStyleMemory(req.user.id, wardrobe, history, user?.profile);
  res.json({ memory });
});

export default router;
