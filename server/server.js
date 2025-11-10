const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const paperUploadRoutes = require('./routes/paperUploadRoutes');
const researchRoutes = require('./routes/researchRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads/papers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static file serving (for PDFs if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/ai', aiRoutes);
const compoundRoutes = require('./routes/compoundRoutes');
const paperRoutes = require('./routes/paperRoutes');
const synthesisRoutes = require('./routes/synthesisRoutes');
app.use('/api/auth', authRoutes);

app.use('/api/compounds', compoundRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/synthesis', synthesisRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/paper-upload', paperUploadRoutes);
app.use('/api/research', researchRoutes);

// MongoDB connection
const { createIndexes } = require('./utils/dbIndexes');

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Create database indexes for better performance
    await createIndexes();
    
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));