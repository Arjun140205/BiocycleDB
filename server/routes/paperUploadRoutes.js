const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/authMiddleware');
const { parsePDF, saveParsedData, getUploadHistory } = require('../controllers/paperUploadController');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/papers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'paper-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
router.post('/parse', auth, upload.single('pdf'), parsePDF);
router.post('/save', auth, saveParsedData);
router.get('/history', auth, getUploadHistory);

module.exports = router;
