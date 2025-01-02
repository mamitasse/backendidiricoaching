const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const axios = require('axios'); // Ajout pour faire une requête à la route d'email

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

    // Appeler la route /send-email pour envoyer l'email de confirmation
    await axios.post('http://localhost:5000/api/send-email', {
      type: 'confirmation',
      name: `${firstName} ${lastName}`,
      email: email,
    });

    res.status(201).json({ message: 'User registered successfully! Email sent.' });
  } catch (error) {
    console.error(error); // Pour le débogage
    res.status(500).json({ error: 'Error registering user' });
  }
});

module.exports = router;
