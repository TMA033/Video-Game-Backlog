import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import process from 'node:process';
import gamesRouter from './routes/games.js';
import eventsRouter from './routes/events.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text()); // Handles IGDB query strings


app.use('/api/games', gamesRouter);
app.use('/api/events', eventsRouter);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});