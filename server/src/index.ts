import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auditRouter } from './routes/audit';

import { leadsRouter } from './routes/leads';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/audit', auditRouter);

app.use('/api/leads', leadsRouter);

app.listen(PORT, () => {
  console.log(`SpendLens server running on http://localhost:${PORT}`);
});

export default app;
