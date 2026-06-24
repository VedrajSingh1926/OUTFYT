import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import outfitRoutes from './routes/outfits.js';
import chatRoutes from './routes/chat.js';
import historyRoutes from './routes/history.js';
import savedRoutes from './routes/saved.js';
import userRoutes from './routes/user.js';
import weatherRoutes from './routes/weather.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/outfits', outfitRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/user', userRoutes);
app.use('/api/weather', weatherRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'OUTFYT API' });
});

app.listen(PORT, () => {
  console.log(`OUTFYT API running on http://localhost:${PORT}`);
});
