const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { submitResearch, getAllResearch } = require('../controllers/researchController');

router.post('/', auth, submitResearch);
router.get('/', getAllResearch);

module.exports = router;
