//IDIRICOACHING/backendendidiricoaching/routes/reservationRoutes.js
const { getReservedSlotsForAdherent } = require("../controllers/reservationController");
const express = require('express');
const { 
    reserveSlot, 
    cancelReservation, 
    getReservedSlotsByAdherent, 
    getAvailableSlotsByCoach 
} = require('../controllers/reservationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const Slot = require('../models/slot'); // Assurez-vous que ce modèle est correctement défini
const router = express.Router();



// Route pour réserver un créneau (réservé aux adhérents)
router.put('/reserve-slot', authMiddleware, roleMiddleware(['adherent']), async (req, res) => {
    const { slotId } = req.body; // ID du créneau à réserver
    const adherentId = req.user.id; // ID de l'utilisateur connecté
  
    try {
      // Vérifier si le créneau existe
      const slot = await Slot.findById(slotId);
      if (!slot) {
        return res.status(404).json({ error: 'Créneau introuvable.' });
      }
  
      // Vérifier si le créneau est déjà réservé
      if (slot.isBooked) {
        return res.status(400).json({ error: 'Ce créneau est déjà réservé.' });
      }
  
      // Mettre à jour le créneau
      slot.isBooked = true;
      slot.bookedBy = adherentId; // ID de l'adhérent ayant réservé
      slot.status = 'reserved'; // Changer le statut en "reserved"
      await slot.save();
  
      res.status(200).json({ message: 'Créneau réservé avec succès.', slot });
    } catch (error) {
      console.error('Erreur lors de la réservation du créneau :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la réservation.' });
    }
  });
  

// Route pour réserver un créneau
router.patch('/reserve-slot', authMiddleware, reserveSlot);


// Route pour récupérer les créneaux réservés d'un adhérent
router.get("/:adherentId/reserved-slots", authMiddleware, getReservedSlotsForAdherent);



// Route pour annuler une réservation (accessible par l'adhérent ou le coach associé)
router.put('/cancel-reservation/:slotId', authMiddleware, async (req, res) => {
    const { slotId } = req.params;

    try {
        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json({ error: 'Créneau introuvable.' });
        }

        if (!slot.isBooked) {
            return res.status(400).json({ error: 'Ce créneau n’est pas réservé.' });
        }

        const slotStartTime = new Date(slot.startTime);
        const currentTime = new Date();

        // Vérifiez que l'annulation est possible (plus de 48h avant le créneau)
        if ((slotStartTime - currentTime) / (1000 * 60 * 60 * 24) < 2) {
            return res.status(400).json({ error: 'Impossible d’annuler ce créneau à moins de 48 heures.' });
        }

        // Annuler la réservation
        slot.isBooked = false;
        slot.bookedBy = null;
        
        await slot.save();
     

        res.status(200).json({ message: 'Créneau annulé avec succès.', slot });
    } catch (error) {
        console.error('Erreur lors de l\'annulation du créneau :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'annulation.' });
    }
});

// Route pour obtenir tous les créneaux réservés par un adhérent (accessible par l'adhérent connecté)
router.get('/adherent/:adherentId/reserved-slots', authMiddleware, roleMiddleware(['adherent']), async (req, res) => {
    const { adherentId } = req.params;
  
    try {
      const reservedSlots = await Slot.find({ bookedBy: adherentId }).populate('coach', 'firstName lastName');
      res.status(200).json(reservedSlots);
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux réservés :', error.message);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des créneaux réservés.' });
    }
  });
  
// Route pour obtenir les créneaux disponibles d'un coach
router.get('/coach/:coachId/available-slots', authMiddleware, async (req, res) => {
    const { coachId } = req.params;

    try {
        const availableSlots = await Slot.find({ coach: coachId, isBooked: false });
        res.status(200).json(availableSlots);
    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux disponibles :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des créneaux disponibles.' });
    }
});

module.exports = router;
