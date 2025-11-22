const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { foodid, rating, comment } = req.body;
  await db.query('INSERT INTO feedback (foodid, rating, comments) VALUES (?, ?, ?)', [foodid, rating || null, comment || null]);
  res.sendStatus(200);
});

router.get('/:foodid', async (req, res) => {
  const [rows] = await db.query('SELECT comments FROM feedback WHERE foodid = ?', [req.params.foodid]);
  res.json(rows);
});

module.exports = router;