const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assurez-vous du chemin correct vers le modèle User


/**
 * Middleware d'authentification pour vérifier le token JWT.
 */


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header manquant.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les données décodées (userId, role) à req.user
    console.log('Utilisateur connecté ID :', req.user.userId);
    next();
  } catch (error) {
    console.error('Erreur de validation du token :', error.message);
    return res.status(401).json({ message: `Token invalide : ${error.message}` });
  }
};

module.exports = { authMiddleware };




/**
 * Middleware de gestion des rôles pour restreindre l'accès.
 * @param {Array<string>} roles - Liste des rôles autorisés.
 */
const roleMiddleware = (roles) => (req, res, next) => {
  try {
    // Vérifie si les informations utilisateur sont présentes
    if (!req.user) {
      console.warn('Erreur : Informations utilisateur manquantes dans la requête.');
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    // Vérifie si l'utilisateur a un rôle autorisé
    if (!roles.includes(req.user.role)) {
      console.warn(
        `Erreur : Accès interdit pour le rôle '${req.user.role}'. Rôles autorisés : ${roles.join(', ')}`
      );
      return res.status(403).json({ error: `Accès interdit pour le rôle '${req.user.role}'.` });
    }

    console.log(`Accès autorisé pour le rôle '${req.user.role}'.`); // Ajout pour débogage
    next(); // Passe au middleware ou au contrôleur suivant
  } catch (error) {
    console.error('Erreur dans le middleware de rôle :', error.message);
    res.status(500).json({ error: 'Erreur serveur dans le middleware de rôle.' });
  }
};

module.exports = { authMiddleware, roleMiddleware };
