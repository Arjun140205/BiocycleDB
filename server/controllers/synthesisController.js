const SynthesisRoute = require('../models/SynthesisRoute');

exports.createSynthesis = async (req, res) => {
  try {
    const synthesis = await SynthesisRoute.create(req.body);
    res.status(201).json(synthesis);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create synthesis', details: err });
  }
};

exports.getAllSynthesis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await SynthesisRoute.countDocuments();
    const synthesis = await SynthesisRoute.find()
      .populate('compoundId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      synthesis,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch synthesis routes', details: err });
  }
};

exports.getSynthesisById = async (req, res) => {
  try {
    const synthesis = await SynthesisRoute.findById(req.params.id).populate('compoundId');
    res.status(200).json(synthesis);
  } catch (err) {
    res.status(404).json({ error: 'Synthesis route not found' });
  }
};