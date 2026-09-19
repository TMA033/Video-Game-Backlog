import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text()); // Handles IGDB query strings

let accessToken = '';

// Helper function to fetch an OAuth token from Twitch
async function getTwitchToken() {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });

    accessToken = response.data.access_token;
    console.log('Successfully retrieved new Twitch Access Token!');
    return true;
  } catch (error) {
    console.error('Error fetching Twitch token:', error.response?.data || error.message);
    return false;
  }
}


async function igdbRequest(endpoint, query) {
  if (!accessToken) {
    const ok = await getTwitchToken();
    if (!ok) throw new Error('Twitch authentication failed');
  }

  const makeReq = () =>
    axios.post(`https://api.igdb.com/v4/${endpoint}`, query, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
    });

  try {
    const res = await makeReq();
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      await getTwitchToken();
      const retryRes = await makeReq();
      return retryRes.data;
    }
    throw err;
  }
}



// 1. POPULAR GAMES
app.get('/api/games/popular', async (req, res) => {
  try {
    const query = `
      fields checksum, name, slug, rating, cover.url, platforms.abbreviation, first_release_date, themes, age_ratings.rating_category;
      where game_type = 0 & hypes != null & cover != null & version_parent = null;
      sort hypes desc;
      limit 50;
    `;

    const games = await igdbRequest('games', query);
    if (!Array.isArray(games)) return res.json([]);

    const cleanGames = games.filter((game) => {
      const isAdultTheme = game.themes?.includes(42);
      const isAO = game.age_ratings?.some((ar) => ar.rating === 5);
      return !isAdultTheme && !isAO;
    });

    res.json(cleanGames);
  } catch (error) {
    console.error('Popular Games Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch popular games' });
  }
});


// 2. SEARCH GAMES
app.get('/api/games/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const query = `
      search "${searchTerm}";
      fields checksum, name, slug, rating, cover.url, first_release_date, themes, age_ratings.rating_category, version_parent;
      where game_type = (0, 8, 9, 4, 10) & version_parent = null;
      limit 40;
    `;

    const games = await igdbRequest('games', query);
    if (!Array.isArray(games)) return res.json([]);

    const cleanGames = games.filter((game) => {
      const isAdultTheme = game.themes?.includes(42);
      const isAO = game.age_ratings?.some((ar) => ar.rating === 5);
      return !isAdultTheme && !isAO;
    });

    res.json(cleanGames);
  } catch (error) {
    console.error('Search Games Error', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search games' });
  }
});


app.get('/api/games/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const query = `
      fields 
        name, 
        slug, 
        summary, 
        storyline, 
        rating, 
        rating_count, 
        first_release_date, 
        cover.url, 
        cover.image_id,
        screenshots.url, 
        screenshots.image_id,
        artworks.url,
        artworks.image_id,
        videos.video_id, 
        genres.name, 
        platforms.name, 
        platforms.abbreviation,
        involved_companies.company.name, 
        involved_companies.developer, 
        involved_companies.publisher,
        similar_games.name,
        similar_games.slug,
        similar_games.cover.url;
      where slug = "${slug}";
      limit 1;
    `;

    const games = await igdbRequest('games', query);

    if (!games || games.length === 0) {
      return res.status(404).json({error: 'Game not found'});
    }

    const game = games[0];

    const formatedGames = formatGameDetails(game);

    res.json(formatedGames);
  } catch (error) {
    console.error('Single Game Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
})

function formatGameDetails(rawGame) {
  const getIgdbUrl = (imageId, size = '1080p') =>
    imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null;

  return {
    id: rawGame.id,
    slug: rawGame.slug,
    name: rawGame.name,
    summary: rawGame.summary || '',
    storyline: rawGame.storyline || '',
    rating: rawGame.rating ? Math.round(rawGame.rating) : null,
    ratingCount: rawGame.rating_count || 0,
    releaseDate: rawGame.first_release_date
      ? new Date(rawGame.first_release_date * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'TBA',
    releaseTimestamp: rawGame.first_release_date ? rawGame.first_release_date * 1000 : null,
    cover: {
      thumbnail: getIgdbUrl(rawGame.cover?.image_id, 'cover_big'),
      full: getIgdbUrl(rawGame.cover?.image_id, '1080p'),
    },
    screenshots: (rawGame.screenshots || []).map((s) => ({
      thumb: getIgdbUrl(s.image_id, 'thumb'),
      full: getIgdbUrl(s.image_id, '1080p'),
    })),
    videos: (rawGame.videos || []).map((v) => ({
      id: v.video_id,
      embedUrl: `https://www.youtube.com/embed/${v.video_id}`,
      thumbnail: `https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`,
    })),
    genres: (rawGame.genres || []).map((g) => g.name),
    platforms: (rawGame.platforms || []).map((p) => p.abbreviation || p.name),
    developers: (rawGame.involved_companies || [])
      .filter((c) => c.developer)
      .map((c) => c.company?.name)
      .filter(Boolean),
    publishers: (rawGame.involved_companies || [])
      .filter((c) => c.publisher)
      .map((c) => c.company?.name)
      .filter(Boolean),
    similarGames: (rawGame.similar_games || []).map((sim) => ({
      name: sim.name,
      slug: sim.slug,
      cover: sim.cover?.url ? `https:${sim.cover.url}` : null,
    })),
  };
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});