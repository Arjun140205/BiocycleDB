const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const contributionRoutes = require('./routes/contributionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));