// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// Créer un nouveau service
router.post('/', async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const newService = new Service({ name, description, price });
    await newService.save();
    res.status(201).json({ message: 'Service créé avec succès !' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du service', error });
  }
});

// Récupérer tous les services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des services', error });
  }
});

module.exports = router;
