const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All watchlist routes require auth
router.use(authMiddleware);

// GET /api/watchlist — get user's watchlist
router.get('/', (req, res) => {
  try {
    const items = db.prepare(
      'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC'
    ).all(req.user.id);
    res.json({ watchlist: items });
  } catch (err) {
    console.error('Watchlist fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch watchlist.' });
  }
});

// POST /api/watchlist — add movie to watchlist
router.post('/', (req, res) => {
  try {
    const {
      movie_id, movie_title, movie_poster,
      movie_backdrop, movie_overview, movie_rating, media_type
    } = req.body;

    if (!movie_id || !movie_title) {
      return res.status(400).json({ message: 'movie_id and movie_title are required.' });
    }

    // Check if already in watchlist
    const existing = db.prepare(
      'SELECT id FROM watchlist WHERE user_id = ? AND movie_id = ?'
    ).get(req.user.id, movie_id);

    if (existing) {
      return res.status(409).json({ message: 'Movie already in watchlist.' });
    }

    db.prepare(`
      INSERT INTO watchlist (user_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_overview, movie_rating, media_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id, movie_id, movie_title,
      movie_poster || null, movie_backdrop || null,
      movie_overview || null, movie_rating || null,
      media_type || 'movie'
    );

    res.status(201).json({ message: 'Added to watchlist!' });
  } catch (err) {
    console.error('Watchlist add error:', err);
    res.status(500).json({ message: 'Failed to add to watchlist.' });
  }
});

// DELETE /api/watchlist/:movieId — remove from watchlist
router.delete('/:movieId', (req, res) => {
  try {
    const result = db.prepare(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?'
    ).run(req.user.id, req.params.movieId);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Movie not found in watchlist.' });
    }

    res.json({ message: 'Removed from watchlist.' });
  } catch (err) {
    console.error('Watchlist remove error:', err);
    res.status(500).json({ message: 'Failed to remove from watchlist.' });
  }
});

module.exports = router;
