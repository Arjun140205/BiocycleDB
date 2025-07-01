const mongoose = require('mongoose');

const compoundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iupacName: { type: String },
  smiles: { type: String, required: true }, // For 3Dmol.js
  category: { type: String }, // e.g., Pyrimidine, Kinazoline
  bioactivity: [String], // e.g., Antiviral, Anticancer
  description: { type: String }, // Plain-language summary
  relatedPapers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }],
  synthesisRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'SynthesisRoute' },
  tags: [String], // e.g., "Heterocycle", "Green Synthesis"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compound', compoundSchema);