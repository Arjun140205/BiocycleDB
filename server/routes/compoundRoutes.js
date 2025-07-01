const express = require('express');
const router = express.Router();
const compoundController = require('../controllers/compoundController');

router.post('/', compoundController.createCompound);
router.get('/', compoundController.getAllCompounds);
router.get('/:id', compoundController.getCompoundById);

module.exports = router;