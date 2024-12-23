const nodemailer = require('nodemailer');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez remplacer par un autre service SMTP si nécessaire
  auth: {
    user: process.env.SMTP_USER, // Votre adresse email (par exemple : exemple@gmail.com)
    pass: process.env.SMTP_PASS, // Le mot de passe d'application
  },
});

// Options de l'email
const mailOptions = {
  from: process.env.SMTP_USER, // Expéditeur
  to: 'idiri.tassa@gmail.com', // Remplacez par l'adresse du destinataire
  subject: 'Test de votre SMTP_PASS',
  text: 'Bonjour, ceci est un test pour vérifier si le SMTP_PASS fonctionne correctement.',
};

// Envoi de l'email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
  } else {
    console.log('Email envoyé avec succès ! Détails :', info.response);
  }
});
