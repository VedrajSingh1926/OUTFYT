import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authMiddleware, mapClerkAuth } from '../middleware/auth.js';
import { refineOutfitChat, buildStyleMemory } from '../services/aiEngine.js';

const router = Router();
router.use(authMiddleware);
router.use(mapClerkAuth);

router.get('/sessions', async (req, res) => {
  let sessions = [];
  try {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });
    sessions = data || [];
  } catch (err) {
    console.warn("DB fallback sessions list:", err.message);
  }
  
  res.json({ sessions });
});

router.get('/sessions/:id', async (req, res) => {
  let session = null;
  try {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    session = data;
  } catch (err) {
    console.warn("DB fallback session details:", err.message);
  }

  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json({ session });
});

router.post('/message', async (req, res) => {
  const { message, sessionId, lastOutfit } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

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
    console.warn("DB fallback chat context:", err.message);
  }

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
    try {
      const { data } = await supabase.from('chat_sessions').select('*').eq('id', sessionId).eq('user_id', req.user.id).single();
      session = data;
    } catch (err) {
      console.warn("DB fallback fetch session:", err.message);
    }
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
    try {
      await supabase.from('chat_sessions').insert([session]);
    } catch (err) {
      console.warn("DB fallback create session:", err.message);
    }
  }

  session.messages.push(userMsg, assistantMsg);
  session.updated_at = new Date().toISOString();

  try {
    await supabase.from('chat_sessions').update({ messages: session.messages, updated_at: session.updated_at }).eq('id', session.id);
  } catch (err) {
    console.warn("DB fallback update session:", err.message);
  }

  const historyEntry = {
    id: crypto.randomUUID(),
    user_id: req.user.id,
    type: 'chat',
    session_id: session.id,
    preview: message,
    created_at: new Date().toISOString(),
  };
  try {
    await supabase.from('outfit_history').insert([historyEntry]);
  } catch (err) {
    console.warn("DB fallback history entry:", err.message);
  }

  res.json({
    sessionId: session.id,
    messages: [userMsg, assistantMsg],
    memory,
  });
});

export default router;
