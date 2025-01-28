const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/secure-route', authMiddleware, (req, res) => {
  res.json({ message: 'Accès sécurisé réussi', user: req.user });
});

module.exports = router;
