import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';
import { refineOutfitChat, buildStyleMemory } from '../services/aiEngine.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

router.get('/sessions', async (req, res) => {
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false });
  
  res.json({ sessions: sessions || [] });
});

router.get('/sessions/:id', async (req, res) => {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json({ session });
});

router.post('/message', async (req, res) => {
  const { message, sessionId, lastOutfit } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single();
  const { data: wardrobeItems } = await supabase.from('wardrobe_items').select('*').eq('user_id', req.user.id);
  const wardrobe = wardrobeItems || [];
  const { data: historyItems } = await supabase.from('outfit_history').select('*').eq('user_id', req.user.id);
  const history = historyItems || [];

  const memory = buildStyleMemory(req.user.id, wardrobe, history, user?.profile);

  const userMsg = {
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
  };

  const { content, outfits } = await refineOutfitChat(message, wardrobe, memory, lastOutfit);
  const assistantMsg = {
    role: 'assistant',
    content,
    outfits,
    timestamp: new Date().toISOString(),
  };

  let session;
  if (sessionId) {
    const { data } = await supabase.from('chat_sessions').select('*').eq('id', sessionId).eq('user_id', req.user.id).single();
    session = data;
  }

  if (!session) {
    session = {
      id: crypto.randomUUID(),
      user_id: req.user.id,
      title: message.slice(0, 40),
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // Initialize session
    await supabase.from('chat_sessions').insert([session]);
  }

  session.messages.push(userMsg, assistantMsg);
  session.updated_at = new Date().toISOString();

  await supabase.from('chat_sessions').update({ messages: session.messages, updated_at: session.updated_at }).eq('id', session.id);

  const historyEntry = {
    id: crypto.randomUUID(),
    user_id: req.user.id,
    type: 'chat',
    session_id: session.id,
    preview: message,
    created_at: new Date().toISOString(),
  };
  await supabase.from('outfit_history').insert([historyEntry]);

  res.json({
    sessionId: session.id,
    messages: [userMsg, assistantMsg],
    memory,
  });
});

export default router;
