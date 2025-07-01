const express = require('express');
const router = express.Router();
const { explainSynthesis } = require('../controllers/aiController');

router.post('/explain', explainSynthesis);

module.exports = router;