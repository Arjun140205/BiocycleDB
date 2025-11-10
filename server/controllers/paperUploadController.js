const Paper = require('../models/Paper');
const Compound = require('../models/Compound');
const SynthesisRoute = require('../models/SynthesisRoute');
const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');

// Parse PDF and extract text
exports.parsePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    // Use OpenAI to extract structured data from the paper
    const extractedData = await extractChemicalData(extractedText);

    res.json({
      success: true,
      filename: req.file.filename,
      filePath: req.file.path,
      extractedText: extractedText.substring(0, 2000), // First 2000 chars for preview
      extractedData: extractedData,
      pageCount: pdfData.numpages
    });

  } catch (error) {
    console.error('PDF parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse PDF', 
      details: error.message 
    });
  }
};

// Use OpenAI to extract chemical information
async function extractChemicalData(text) {
  try {
    const prompt = `You are a chemistry research paper analyzer. Extract the following information from this research paper text and return it as valid JSON:

1. Paper metadata: title, authors (array), abstract, journal, year, keywords (array)
2. Compounds mentioned: array of objects with {name, category, description, possibleSMILES}
3. Synthesis routes: array of objects with {name, steps: [{stepNumber, from, to, reagent, conditions, description}]}

Text to analyze:
${text.substring(0, 12000)}

Return ONLY valid JSON in this exact format:
{
  "paper": {
    "title": "...",
    "authors": ["..."],
    "abstract": "...",
    "journal": "...",
    "year": 2024,
    "keywords": ["..."]
  },
  "compounds": [
    {
      "name": "...",
      "category": "...",
      "description": "...",
      "possibleSMILES": "..."
    }
  ],
  "synthesisRoutes": [
    {
      "name": "...",
      "steps": [
        {
          "stepNumber": 1,
          "from": "...",
          "to": "...",
          "reagent": "...",
          "conditions": "...",
          "description": "..."
        }
      ]
    }
  ]
}`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a chemistry expert that extracts structured data from research papers. Always return valid JSON." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 4000
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    
    // Try to parse JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(aiResponse);

  } catch (error) {
    console.error('OpenAI extraction error:', error.response?.data || error.message);
    
    // Return empty structure if AI fails
    return {
      paper: {
        title: "Unable to extract",
        authors: [],
        abstract: "",
        journal: "",
        year: new Date().getFullYear(),
        keywords: []
      },
      compounds: [],
      synthesisRoutes: []
    };
  }
}

// Save parsed data to database
exports.saveParsedData = async (req, res) => {
  try {
    const { paperData, compounds, synthesisRoutes, pdfPath } = req.body;
    const userId = req.user?.userId;

    // 1. Create Paper
    const paper = await Paper.create({
      ...paperData,
      pdfUrl: pdfPath,
      contributor: userId,
      tags: paperData.keywords || []
    });

    const createdCompounds = [];
    const createdSynthesis = [];

    // 2. Create Compounds
    for (const compoundData of compounds) {
      try {
        const compound = await Compound.create({
          name: compoundData.name,
          smiles: compoundData.possibleSMILES || compoundData.smiles || "",
          category: compoundData.category || "Heterocycle",
          description: compoundData.description || "",
          bioactivity: compoundData.bioactivity || [],
          tags: compoundData.tags || [],
          relatedPapers: [paper._id]
        });
        createdCompounds.push(compound);
      } catch (err) {
        console.error('Error creating compound:', err);
      }
    }

    // 3. Create Synthesis Routes
    for (const routeData of synthesisRoutes) {
      try {
        // Find matching compound or use first one
        const matchingCompound = createdCompounds.find(c => 
          routeData.name.toLowerCase().includes(c.name.toLowerCase())
        ) || createdCompounds[0];

        if (matchingCompound) {
          const synthesis = await SynthesisRoute.create({
            name: routeData.name,
            compoundId: matchingCompound._id,
            createdBy: userId,
            status: 'pending',
            steps: routeData.steps || [],
            notes: routeData.notes || "Extracted from uploaded paper"
          });
          createdSynthesis.push(synthesis);

          // Link synthesis to compound
          matchingCompound.synthesisRoute = synthesis._id;
          await matchingCompound.save();
        }
      } catch (err) {
        console.error('Error creating synthesis route:', err);
      }
    }

    // 4. Update paper with related compounds
    paper.relatedCompounds = createdCompounds.map(c => c._id);
    await paper.save();

    res.json({
      success: true,
      message: 'Paper and extracted data saved successfully',
      data: {
        paper: paper,
        compoundsCreated: createdCompounds.length,
        synthesisCreated: createdSynthesis.length
      }
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ 
      error: 'Failed to save parsed data', 
      details: error.message 
    });
  }
};

// Get upload history
exports.getUploadHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const papers = await Paper.find({ contributor: userId })
      .populate('relatedCompounds')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(papers);
  } catch (error) {
    console.error('Error fetching upload history:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
};
