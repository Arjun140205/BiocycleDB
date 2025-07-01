const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { submitContribution } = require('../controllers/contributionController');

router.post('/submit', auth, submitContribution);

module.exports = router;