import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

router.get('/', async (req, res) => {
  const { data: looks } = await supabase.from('saved_looks').select('*').eq('user_id', req.user.id);
  const { data: collections } = await supabase.from('collections').select('*').eq('user_id', req.user.id);
  res.json({ looks: looks || [], collections: collections || [] });
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
  
  const { data } = await supabase.from('collections').insert([collection]).select().single();
  res.json({ collection: data || collection });
});

router.delete('/:id', async (req, res) => {
  await supabase
    .from('saved_looks')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
    
  res.json({ ok: true });
});

export default router;
