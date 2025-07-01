const express = require('express');
const router = express.Router();
const synthesisController = require('../controllers/synthesisController');

router.post('/', synthesisController.createSynthesis);
router.get('/', synthesisController.getAllSynthesis);
router.get('/:id', synthesisController.getSynthesisById);

module.exports = router;