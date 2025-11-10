const Paper = require('../models/Paper');

exports.submitResearch = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      title,
      authors,
      abstract,
      keywords,
      researchType,
      compounds,
      methodology,
      results,
      conclusions,
      references
    } = req.body;

    // Create paper document with research data
    const paper = await Paper.create({
      title,
      authors: Array.isArray(authors) ? authors : [],
      abstract,
      journal: researchType || 'User Submission',
      year: new Date().getFullYear(),
      tags: Array.isArray(keywords) ? keywords : [],
      contributor: userId,
      // Store additional research data in a notes field or extend the schema
      link: '', // Can be added later
      pdfUrl: '', // Can be added later
      relatedCompounds: [] // Can be linked later
    });

    res.status(201).json({
      success: true,
      message: 'Research submitted successfully',
      paper: paper
    });

  } catch (error) {
    console.error('Research submission error:', error);
    res.status(500).json({
      error: 'Failed to submit research',
      details: error.message
    });
  }
};

exports.getAllResearch = async (req, res) => {
  try {
    const research = await Paper.find()
      .populate('contributor', 'name email')
      .populate('relatedCompounds')
      .sort({ createdAt: -1 });

    res.json(research);
  } catch (error) {
    console.error('Error fetching research:', error);
    res.status(500).json({ error: 'Failed to fetch research' });
  }
};
