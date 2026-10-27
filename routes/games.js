import express from 'express';
import { igdbRequest } from '../services/igdb.js';
import { logApiError } from '../utils/logApiError.js';

const router = express.Router();


// gets the top games
router.get('/popular', async (req, res) => {
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
    logApiError('Popular Games Error', error);
    res.status(500).json({ error: 'Failed to fetch popular games' });
  }
});


// 2. SEARCH GAMES
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (typeof searchTerm !== 'string' || !searchTerm.trim()) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    const trimmedSearchTerm = searchTerm.trim();


    if(trimmedSearchTerm.length > 100) {
      return res.status(400).json({
        error: 'Search query must be 100 characters or fewer'
      })
    }

    if (/["\\]/.test(trimmedSearchTerm)) {
      return res.status(400).json({
        error: 'Search query contains unsupported characters',
      });
    }

    

    const query = `
      search "${trimmedSearchTerm}";
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
    logApiError('Search Games Error', error);
    res.status(500).json({ error: 'Failed to search games' });
  }
});




// Get the games individual details
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({
        error: 'Invalid game slug',
      });
    }


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
    logApiError('Game Details Error', error);
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

export default router;