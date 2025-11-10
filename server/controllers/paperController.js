const Paper = require('../models/Paper');

exports.createPaper = async (req, res) => {
  try {
    const paper = await Paper.create(req.body);
    res.status(201).json(paper);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create paper', details: err });
  }
};

exports.getAllPapers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Paper.countDocuments();
    const papers = await Paper.find()
      .populate('relatedCompounds')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      papers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch papers', details: err });
  }
};

exports.getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('relatedCompounds');
    res.status(200).json(paper);
  } catch (err) {
    res.status(404).json({ error: 'Paper not found' });
  }
};