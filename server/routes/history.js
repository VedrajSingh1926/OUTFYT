import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

router.get('/', async (req, res) => {
  const { q, type } = req.query;
  
  let query = supabase
    .from('outfit_history')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  let items = [];
  try {
    const { data } = await query;
    items = data || [];
  } catch (err) {
    console.warn("DB fallback history:", err.message);
  }
  let finalItems = items;

  if (q && finalItems.length > 0) {
    const searchString = q.toLowerCase();
    finalItems = finalItems.filter((h) =>
      JSON.stringify(h).toLowerCase().includes(searchString)
    );
  }

  res.json({ history: finalItems });
});

export default router;
