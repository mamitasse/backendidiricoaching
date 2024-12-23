//IDIRICOACHING/backendendidiricoaching/routes/register.js

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, gender, age, coachId } = req.body;


  try {
    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Validation pour le rôle 'Adhérent'
    if (role === 'adherent' && !coachId) {
      return res.status(400).json({ error: 'Coach selection is required for Adhérent role.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      gender,
      age,
      coachId, // Ajout du coach au modèle User
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error); // Pour le débogage
    res.status(500).json({ error: 'Error registering user' });
  }
});

module.exports = router;
