const mongoose = require('mongoose');

const synthesisRouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  compoundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Compound', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  steps: [
    {
      stepNumber: Number,
      from: String, // precursor (SMILES or name)
      to: String, // product
      description: String,
      reagent: String,
      conditions: String,
    }
  ],
  visual: { type: String }, // Optional image or diagram URL
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SynthesisRoute', synthesisRouteSchema);