//IDIRICOACHING/backendendidiricoaching/server.js

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Vérification des variables d'environnement critiques
if (!process.env.MONGO_URI) {
  console.error('⚠️  La variable d\'environnement MONGO_URI est manquante.');
  process.exit(1);
}

// Connexion à MongoDB


mongoose.connect(process.env.MONGO_URI, {

  serverSelectionTimeoutMS: 30000, // Temps d'attente pour se connecter
})
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1); // Quitter si la connexion échoue
  });



// Middleware globaux
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', // URL du frontend
  credentials: true, // Permet l'envoi des cookies (si nécessaire)
}));

// Importation des routes
const userRoutes = require('./routes/userRoutes');

const coachRoutes = require('./routes/coachRoutes');
const slotRoutes = require('./routes/slotRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const emailRoutes = require('./routes/emailRoutes');
const registerRoutes=require('./routes/register')
// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/register', registerRoutes);

/*// Debug : Afficher toutes les routes enregistrées
console.log("Liste des routes enregistrées :");
app._router.stack.forEach((middleware) => {
  if (middleware.route) { // Si c'est une route
    console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === 'router') { // Si c'est un routeur (nested routes)
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(`${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
      }
    });
  }
});*/





// Gestion des erreurs 404 pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ressource non trouvée.' });
});

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur détectée :', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur.',
  });
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});


