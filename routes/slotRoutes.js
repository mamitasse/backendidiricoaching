const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { generateDefaultSlots, getSlots, deleteDaySlots, deleteSelectedSlots,updateSlotStatus } = require('../controllers/slotController');

const router = express.Router();
const { getAdherentsForCoach } = require('../controllers/coachController');

// Route pour mettre à jour le statut d'un créneau
router.patch('/update-status', authMiddleware, updateSlotStatus);

router.get('/adherents', authMiddleware, roleMiddleware(['coach']), getAdherentsForCoach);

router.post('/generate-default', authMiddleware, roleMiddleware(['coach']), generateDefaultSlots);
router.get('/', authMiddleware, getSlots);
router.delete('/delete-day', authMiddleware, roleMiddleware(['coach']), deleteDaySlots);
router.delete('/delete-slots', authMiddleware, roleMiddleware(['coach']), deleteSelectedSlots);

module.exports = router;
