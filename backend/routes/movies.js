const express = require('express');
const axios = require('axios');

const router = express.Router();

const TMDB_BASE = process.env.TMDB_BASE_URL;
const TMDB_KEY = process.env.TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: TMDB_KEY, language: 'en-US' }
});

// Helper: format movie object
const formatMovie = (m) => ({
  id: m.id,
  title: m.title || m.name,
  overview: m.overview,
  poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
  backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null,
  rating: m.vote_average,
  release_date: m.release_date || m.first_air_date,
  media_type: m.media_type || 'movie',
  genre_ids: m.genre_ids || []
});

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
  try {
    const { data } = await tmdb.get('/trending/all/week');
    res.json({ results: data.results.map(formatMovie) });
  } catch (err) {
    console.error('Trending error:', err.message);
    res.status(500).json({ message: 'Failed to fetch trending movies.' });
  }
});

// GET /api/movies/popular
router.get('/popular', async (req, res) => {
  try {
    const { data } = await tmdb.get('/movie/popular');
    res.json({ results: data.results.map(formatMovie) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular movies.' });
  }
});

// GET /api/movies/top-rated
router.get('/top-rated', async (req, res) => {
  try {
    const { data } = await tmdb.get('/movie/top_rated');
    res.json({ results: data.results.map(formatMovie) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top rated movies.' });
  }
});

// GET /api/movies/action
router.get('/action', async (req, res) => {
  try {
    const { data } = await tmdb.get('/discover/movie', {
      params: { with_genres: 28, sort_by: 'popularity.desc' }
    });
    res.json({ results: data.results.map(formatMovie) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch action movies.' });
  }
});

// GET /api/movies/comedy
router.get('/comedy', async (req, res) => {
  try {
    const { data } = await tmdb.get('/discover/movie', {
      params: { with_genres: 35, sort_by: 'popularity.desc' }
    });
    res.json({ results: data.results.map(formatMovie) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comedy movies.' });
  }
});

// GET /api/movies/horror
router.get('/horror', async (req, res) => {
  try {
    const { data } = await tmdb.get('/discover/movie', {
      params: { with_genres: 27, sort_by: 'popularity.desc' }
    });
    res.json({ results: data.results.map(formatMovie) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch horror movies.' });
  }
});

// GET /api/movies/tv-shows
router.get('/tv-shows', async (req, res) => {
  try {
    const { data } = await tmdb.get('/tv/popular');
    res.json({ results: data.results.map(m => ({ ...formatMovie(m), media_type: 'tv' })) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch TV shows.' });
  }
});

// GET /api/movies/search?q=query
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query param "q" is required.' });

  try {
    const { data } = await tmdb.get('/search/multi', { params: { query: q } });
    const filtered = data.results
      .filter(m => m.media_type !== 'person')
      .map(formatMovie);
    res.json({ results: filtered });
  } catch (err) {
    res.status(500).json({ message: 'Search failed.' });
  }
});

// GET /api/movies/:id?type=movie|tv
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  try {
    const { data } = await tmdb.get(`/${type}/${id}`, {
      params: { append_to_response: 'videos,credits' }
    });

    const trailer = data.videos?.results?.find(
      v => v.type === 'Trailer' && v.site === 'YouTube'
    );

    res.json({
      ...formatMovie(data),
      genres: data.genres || [],
      runtime: data.runtime || data.episode_run_time?.[0] || null,
      trailer_key: trailer?.key || null,
      cast: data.credits?.cast?.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character,
        photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
      })) || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie details.' });
  }
});

module.exports = router;
