const Slot = require('../models/slot'); // Chemin correct vers votre modèle Slot



exports.getReservedSlotsForAdherent = async (req, res) => {
  const { adherentId } = req.params; // Récupère l'ID de l'adhérent depuis les paramètres de la requête

  try {
    // Chercher les créneaux réservés pour l'adhérent
    const reservedSlots = await Slot.find({
      bookedBy: adherentId,
      status: "reserved"
    }).populate("coach"); // Populate les informations du coach

    if (!reservedSlots || reservedSlots.length === 0) {
      return res.status(404).json({ message: "Aucun créneau réservé trouvé pour cet adhérent." });
    }

    res.status(200).json(reservedSlots);
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux réservés :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des créneaux réservés." });
  }
};



exports.reserveSlot = async (req, res) => {
  const { slotId } = req.body;
  const adherentId = req.user.userId; // ID de l'adhérent connecté

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ error: 'Créneau introuvable.' });
    }

    if (slot.status !== 'available') {
      return res.status(400).json({ error: 'Ce créneau est déjà réservé ou indisponible.' });
    }

    // Mettre à jour le créneau comme réservé
    slot.status = 'reserved';
    slot.bookedBy = adherentId; // Associer l'adhérent au créneau
    await slot.save(); // Enregistrer les modifications dans la base de données

    res.status(200).json({ message: 'Créneau réservé avec succès.', slot });
  } catch (error) {
    console.error('Erreur lors de la réservation du créneau :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la réservation.' });
  }
};
