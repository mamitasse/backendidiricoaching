//IDIRICOACHING/backendendidiricoaching/controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Contrôleur pour l'inscription des utilisateurs (existant)
// Contrôleur pour enregistrer un utilisateur
const registerAdherent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, age, coachId, phone, address } = req.body;

    // Vérifications de validation
    if (!firstName || !lastName || !email || !password || !gender || !age || !phone || !address) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      age,
      coachId,
      phone,
      address,
    });

    await newUser.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur. Veuillez réessayer plus tard.' });
  }
};

module.exports = { registerAdherent };

// Contrôleur pour la connexion des utilisateurs
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Créer un token JWT incluant le rôle et l'ID utilisateur
    const token = jwt.sign(
      { userId: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Réponse avec le token et les informations utilisateur
    res.json({
      token,
      message: 'Connexion réussie.',
      user: {
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};
