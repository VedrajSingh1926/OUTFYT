import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

router.get('/', async (req, res) => {
  let looks = [];
  let collections = [];
  try {
    const { data: looksData } = await supabase.from('saved_looks').select('*').eq('user_id', req.user.id);
    looks = looksData || [];
    const { data: collectionsData } = await supabase.from('collections').select('*').eq('user_id', req.user.id);
    collections = collectionsData || [];
  } catch (err) {
    console.warn("DB fallback saved get:", err.message);
  }
  res.json({ looks, collections });
});

router.post('/collections', async (req, res) => {
  const { name, color } = req.body;
  const collection = {
    id: crypto.randomUUID(),
    user_id: req.user.id,
    name: name || 'New Collection',
    color: color || '#7C6CFF',
    created_at: new Date().toISOString(),
  };
  
  let created = collection;
  try {
    const { data } = await supabase.from('collections').insert([collection]).select().single();
    if (data) created = data;
  } catch (err) {
    console.warn("DB fallback collection create:", err.message);
  }
  res.json({ collection: created });
});

router.delete('/:id', async (req, res) => {
  try {
    await supabase
      .from('saved_looks')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
  } catch (err) {
    console.warn("DB fallback delete saved look:", err.message);
  }
    
  res.json({ ok: true });
});

export default router;
