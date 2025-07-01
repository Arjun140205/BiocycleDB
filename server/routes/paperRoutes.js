const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');

router.post('/', paperController.createPaper);
router.get('/', paperController.getAllPapers);
router.get('/:id', paperController.getPaperById);

module.exports = router;