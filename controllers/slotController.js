const Slot = require('../models/slot');
const mongoose = require('mongoose');



/**
 * Génère les créneaux par défaut pour une date donnée.
 */
exports.generateDefaultSlots = async (req, res) => {
  const { date } = req.body;

  try {
    // Validation : Vérifiez si la date est dans le passé
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    if (date < today) {
      return res.status(400).json({ error: 'Impossible de créer des créneaux pour une date passée.' });
    }

    // Vérifiez si des créneaux existent déjà pour la date et le coach
    const existingSlots = await Slot.find({ date, coach: req.user.userId });
    if (existingSlots.length > 0) {
      return res.status(400).json({ error: 'Des créneaux existent déjà pour cette date.' });
    }

    // Générer les créneaux par défaut
    const slots = [];
    for (let hour = 8; hour < 21; hour++) {
      slots.push({
        coach: req.user.userId,
        date,
        startTime: `${hour}:00`,
        endTime: `${hour + 1}:00`,
        status: 'available',
      });
    }

    await Slot.insertMany(slots);
    res.status(201).json({ message: 'Créneaux générés avec succès.', slots });
  } catch (error) {
    console.error('Erreur lors de la génération des créneaux par défaut :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la génération des créneaux.' });
  }
};



exports.getSlots = async (req, res) => {
  const { date } = req.query;
  console.log('Requête reçue pour la date :', date); // Debug

  try {
    const slots = await Slot.find({ date, coach: req.user.userId });
    console.log('Créneaux trouvés :', slots); // Debug
    res.status(200).json(slots);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.deleteDaySlots = async (req, res) => {
  const { date } = req.body;

  try {
    await Slot.deleteMany({ coach: req.user._id, date });
    res.status(200).json({ message: 'Créneaux supprimés.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression des créneaux.' });
  }
};

exports.deleteSelectedSlots = async (req, res) => {
  const { slotIds } = req.body;

  try {
    await Slot.deleteMany({ _id: { $in: slotIds }, coach: req.user._id });
    res.status(200).json({ message: 'Créneaux sélectionnés supprimés.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression des créneaux sélectionnés.' });
  }
};


exports.updateSlotStatus = async (req, res) => {
  const { slotId, status } = req.body;

  // Vérifiez que slotId est un ObjectId valide
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ message: 'ID de créneau invalide.' });
  }

  try {
    const updatedSlot = await Slot.findByIdAndUpdate(
      slotId,
      { status },
      { new: true } // Retourne le créneau mis à jour
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Créneau non trouvé.' });
    }

    res.status(200).json(updatedSlot);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du créneau :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.addSlot = async (req, res) => {
  console.log("Données reçues :", req.body);

  const { coachId, date, startTime, endTime, status } = req.body;

  if (!coachId || !date || !startTime || !endTime) {
    console.log("Champs manquants :", { coachId, date, startTime, endTime });
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    const newSlot = new Slot({
      coach: coachId,
      date,
      startTime,
      endTime,
      status: status || "available",
    });
    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (error) {
    console.error("Erreur lors de l’ajout du créneau :", error);
    res.status(500).json({ error: "Erreur serveur lors de l’ajout du créneau." });
  }
};

const moment = require('moment'); // Utilisez moment.js pour manipuler les dates si nécessaire

/**
 * Supprime les créneaux disponibles pour les dates passées.
 */
exports.deletePastSlots = async (coachId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Obtenez la date actuelle au format YYYY-MM-DD
    const result = await Slot.deleteMany({
      coach: coachId,
      date: { $lt: today }, // Dates inférieures à aujourd'hui
      status: 'available', // Seulement les créneaux disponibles
    });

    console.log(`Créneaux supprimés : ${result.deletedCount}`);
  } catch (error) {
    console.error('Erreur lors de la suppression des créneaux obsolètes :', error);
  }
};
