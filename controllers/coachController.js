//IDIRICOACHING/backendendidiricoaching/controllers/coachController.js

const User = require('../models/user');
const Slot = require('../models/slot');



/**
* Récupérer les adhérents liés à un coach.
*/
exports.getAdherentsForCoach = async (req, res) => {
 try {
   const coachId = req.user._id; // ID du coach connecté
   const adherents = await User.find({ coachId: coachId, role: 'adherent' }).select('firstName lastName email');
   res.status(200).json(adherents); // Renvoie la liste des adhérents liés
 } catch (error) {
   console.error('Erreur lors de la récupération des adhérents :', error.message);
   res.status(500).json({ error: 'Erreur serveur lors de la récupération des adhérents.' });
 }
};




exports.getAvailableSlotsByCoach = async (req, res) => {
  const { coachId } = req.params;

  try {
    // Vérifier que l'ID du coach est valide
    if (!coachId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID du coach invalide." });
    }

    // Récupérer les créneaux disponibles pour ce coach
    const slots = await Slot.find({ coach: coachId, status: "available" }).sort({ startTime: 1 });

    if (!slots || slots.length === 0) {
      return res.status(404).json({ message: "Aucun créneau disponible trouvé." });
    }

    res.status(200).json(slots);
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des créneaux." });
  }
};


exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ coachId: req.params.coachId, isBooked: false });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des créneaux' });
  }
};

exports.reserveSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Créneau non disponible.' });
    }
    slot.isBooked = true;
    slot.adherent = req.user.id;
    await slot.save();
    res.status(200).json({ message: 'Créneau réservé avec succès.', slot });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réservation du créneau' });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.slotId);
    if (!slot || !slot.isBooked) {
      return res.status(400).json({ message: 'Ce créneau n\'est pas réservé.' });
    }
    slot.isBooked = false;
    slot.adherent = null;
    await slot.save();
    res.status(200).json({ message: 'Réservation annulée avec succès.', slot });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la réservation.' });
  }
};

exports.getReservedSlotsByAdherent = async (req, res) => {
  try {
    const slots = await Slot.find({ adherent: req.params.adherentId, isBooked: true });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des créneaux réservés.' });
  }
};



exports.getSlotsByCoach = async (req, res) => {
  try {
    const coachId = req.params.coachId;
    console.log('Requête reçue pour le coach :', coachId);

    if (!coachId) {
      return res.status(400).json({ error: 'ID du coach manquant.' });
    }

    const slots = await Slot.find({ coach: coachId, status: 'available' });
    if (!slots || slots.length === 0) {
      return res.status(404).json({ error: 'Aucun créneau disponible trouvé.' });
    }

    res.status(200).json(slots);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
