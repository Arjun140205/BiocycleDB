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
    const papers = await Paper.find().populate('relatedCompounds');
    res.status(200).json(papers);
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