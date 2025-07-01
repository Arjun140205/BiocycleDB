const Compound = require('../models/Compound');

exports.createCompound = async (req, res) => {
  try {
    const compound = await Compound.create(req.body);
    res.status(201).json(compound);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create compound', details: err });
  }
};

exports.getAllCompounds = async (req, res) => {
  try {
    const compounds = await Compound.find().populate('relatedPapers synthesisRoute');
    res.status(200).json(compounds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch compounds', details: err });
  }
};

exports.getCompoundById = async (req, res) => {
  try {
    const compound = await Compound.findById(req.params.id).populate('relatedPapers synthesisRoute');
    res.status(200).json(compound);
  } catch (err) {
    res.status(404).json({ error: 'Compound not found' });
  }
};