const axios = require('axios');

exports.explainSynthesis = async (req, res) => {
  const { steps } = req.body;
  if (!steps || !Array.isArray(steps)) {
    return res.status(400).json({ error: "Invalid steps input" });
  }

  const prompt = `Explain this organic synthesis in simple terms like you're teaching a college student:\n\n` +
    steps.map((step, i) => (
      `Step ${i + 1}: React ${step.from} with ${step.reagent || "a reagent"} under ${step.conditions || "standard conditions"} to form ${step.to}.`
    )).join("\n");

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    res.json({ explanation: aiMessage });

  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate AI explanation" });
  }
};