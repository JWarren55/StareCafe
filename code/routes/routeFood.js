const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:foodid', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM menu WHERE foodid = ?', [req.params.foodid]);
  res.json(rows[0]);
});

module.exports = router;