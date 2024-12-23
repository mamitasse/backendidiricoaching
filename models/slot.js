const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence au modèle User
      required: true,
    },
    date: {
      type: String, // Format YYYY-MM-DD
      required: true,
    },
    startTime: {
      type: String, // Format HH:mm
      required: true,
    },
    endTime: {
      type: String, // Format HH:mm
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'unavailable'],
      default: 'available',
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence à l'adhérent ayant réservé le créneau
      default: null,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

module.exports = mongoose.model('Slot', slotSchema);
