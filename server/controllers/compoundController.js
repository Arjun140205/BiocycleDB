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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await Compound.countDocuments();
    const compounds = await Compound.find()
      .populate('relatedPapers synthesisRoute')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      compounds,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
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