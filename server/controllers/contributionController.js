const Compound = require('../models/Compound');
const Paper = require('../models/Paper');
const SynthesisRoute = require('../models/SynthesisRoute');

exports.submitContribution = async (req, res) => {
  const { compoundData, paperData, synthesisData } = req.body;
  const userId = req.user.userId;

  try {
    // Save compound
    const compound = await Compound.create({ ...compoundData });

    // Save paper if provided
    let paper = null;
    if (paperData && paperData.title) {
      paper = await Paper.create({ ...paperData, contributor: userId });
      compound.relatedPapers = [paper._id];
      await compound.save();
    }

    // Save synthesis route
    const synthesis = await SynthesisRoute.create({
      ...synthesisData,
      compoundId: compound._id,
      createdBy: userId,
      status: "pending"
    });

    res.status(201).json({ message: "Contribution submitted!", synthesisId: synthesis._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
};