//IDIRICOACHING/backendendidiricoaching/routes/login.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Identifiants invalides' });

    // Créer un token JWT avec l'ID et le rôle de l'utilisateur
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Renvoyer le token et le rôle de l'utilisateur dans la réponse
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error); // Pour aider à déboguer
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
