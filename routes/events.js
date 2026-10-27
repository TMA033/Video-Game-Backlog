import express from 'express';
import { igdbRequest } from '../services/igdb.js';
import { logApiError } from '../utils/logApiError.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {

    const query = `
      fields
        name,
        description,
        start_time,
        end_time,
        live_stream_url,
        event_logo.image_id,
        games.name,
        games.slug,
        games.cover.image_id,
        videos.video_id;
      where start_time != null;
      sort start_time desc;
      limit 30;
    `;

    const events = await igdbRequest('events', query);
    if (!Array.isArray(events)) return res.json([]);

    const formattedEvents = events.map((event) => formatEvent(event));
    res.json(formattedEvents);
  } catch (error) {
    logApiError('Events Error', error);
    res.status(500).json({error: 'Failed to fetch events'});
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: 'Invalid event ID',
      });
    }

    const query = `
      fields 
        name, 
        description, 
        start_time, 
        end_time, 
        live_stream_url, 
        event_logo.image_id,
        games.name,
        games.slug,
        games.cover.image_id,
        videos.video_id;
      where id = ${id};
      limit 1;
    `;

    const events = await igdbRequest('events', query);

    if (!events || events.length === 0) {
      return res.status(404).json({error: 'Events not found'});
    }

    res.json(formatEvent(events[0]));
  } catch (error) {
    logApiError('Event Details Error', error);
    res.status(500).json({error: 'Failed to fetch event details'});
  }
});

function formatEvent(rawEvent) {
  const getIgdbUrl = (imageId, size = '1080p') =>
    imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null;

  return {
    id: rawEvent.id,
    name: rawEvent.name,
    description: rawEvent.description || '',
    liveStreamUrl: rawEvent.live_stream_url || null,
    startTime: rawEvent.start_time
      ? new Date(rawEvent.start_time * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null,
    startTimestamp: rawEvent.start_time ? rawEvent.start_time * 1000 : null,
    endTime: rawEvent.end_time
      ? new Date(rawEvent.end_time * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null,
    endTimestamp: rawEvent.end_time ? rawEvent.end_time * 1000 : null,
    logo: rawEvent.event_logo
      ? {
          thumbnail: getIgdbUrl(rawEvent.event_logo.image_id, 'logo_med'),
          full: getIgdbUrl(rawEvent.event_logo.image_id, '1080p'),
        }
      : null,
    games: (rawEvent.games || []).map((game) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      cover: getIgdbUrl(game.cover?.image_id, 'cover_big'),
    })),
    videos: (rawEvent.videos || []).map((v) => ({
      id: v.video_id,
      embedUrl: `https://www.youtube.com/embed/${v.video_id}`,
      thumbnail: `https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`,
    })),
  };
}

export default router;