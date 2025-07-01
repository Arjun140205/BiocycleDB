const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [String],
  abstract: { type: String },
  journal: { type: String },
  year: { type: Number },
  link: { type: String }, // DOI or external URL
  pdfUrl: { type: String }, // Optional PDF file stored locally or via cloud
  relatedCompounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compound' }],
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String], // e.g., "Enzymatic Route", "Cyclization"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Paper', paperSchema);