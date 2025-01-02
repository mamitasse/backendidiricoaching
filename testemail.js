const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
  from: process.env.SMTP_USER,
  to: 'idiri.tassa@gmail.com',
  subject: 'Test Email',
  text: 'Ceci est un test pour vérifier la configuration nodemailer.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Erreur :', error);
  }
  console.log('Email envoyé :', info.response);
});
