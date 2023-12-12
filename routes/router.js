const express = require('express');
const authController = require('./../controllers/authController');
const establishmentController = require('./../controllers/establishmentController');

const router = express.Router();

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Establishment Routes
router.post('/establishments', establishmentController.create);
router.get('/establishments', establishmentController.getAll);
router.get('/establishments/:id', establishmentController.getById);
router.put('/establishments/:id', establishmentController.update);
router.delete('/establishments/:id', establishmentController.delete);

// Review Routes
router.post('/establishments/:id/reviews', establishmentController.addReview);
router.put('/reviews/:reviewId', establishmentController.updateReview);
router.delete('/reviews/:reviewId', establishmentController.deleteReview);

module.exports = router;
