const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret pour signer les tokens
const secret = process.env.JWT_SECRET || "default_secret_key";

// Coachs à gérer
const coaches = [
  {
    userId: "67059d82a737404ce4adeeaa", // ID de Nadia
    firstName: "nadia",
    role: "coach",
  },
  {
    userId: "67059d25a737404ce4adeea7", // ID de Sabrina
    firstName: "sabrina",
    role: "coach",
  },
];

// Générer et sauvegarder les tokens
const envPath = '.env';
coaches.forEach((coach) => {
  const token = jwt.sign(
    { userId: coach.userId, role: coach.role },
    secret,
    { expiresIn: '10y' } // 10 ans d'expiration
  );

  console.log(`Token pour ${coach.firstName} généré :`, token);

  // Ajouter le token au fichier .env
  const envVar = `TOKEN_${coach.firstName.toUpperCase()}=${token}\n`;
  fs.appendFileSync(envPath, envVar, 'utf8');
});

console.log(`Tous les tokens ont été sauvegardés dans ${envPath}`);
