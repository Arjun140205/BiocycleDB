const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Paper = require("../models/Paper");

const MONGO_URI = process.env.MONGO_URI;

const papers = [
  {
    title: "Synthesis of 1,2,4 – Triazolo-Tetrazolo-and 2-Pyrazolyl-Quinazolines",
    journal: "Indian Journal of Heterocyclic Chem. 15. 101",
    year: 2005,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Quinazoline", "Triazole", "Heterocyclic"],
    abstract:
      "This study explores the synthesis and structural modification of Triazolo- and Pyrazolyl-substituted Quinazolines using nitrogen-rich precursors for potential CNS applications.",
    pdfUrl: "", // add if available
    link: "",   // add if available
  },
  {
    title: "Synthesis of Novel Bis-condensed Heterocyclic Ring Assembly System",
    journal: "J. Heterocyclic Chem. 43. 1173",
    year: 2006,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Heterocyclic", "Condensation", "Ring Fusion"],
    abstract:
      "Describes the formation of bis-condensed heterocyclic ring systems using bifunctional nucleophiles for dual activity screening.",
  },
  {
    title: "Synthesis of Some Thiazoloimiadazo-Quinoline and Quinazolinone Systems",
    journal: "J. Heterocyclic Chem. 16. 125",
    year: 2006,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Thiazole", "Imidazole", "Quinazolinone"],
    abstract:
      "Combines Thiazole and Imidazole scaffolds on a Quinoline/Quinazolinone backbone to explore pharmaceutical potential.",
  },
  {
    title: "Synthesis of Quinazolinophanes with Bridgehead Nitrogen",
    journal: "J. Heterocyclic Chem. 44. 1501",
    year: 2007,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Quinazoline", "Macrocycle", "Bridgehead Nitrogen"],
    abstract:
      "Presents a novel synthesis of nitrogen-bridged macrocyclic Quinazolinophanes using template-assisted cyclization.",
  },
  {
    title: "Synthesis of Indole Based Spiro and Condensed Heterocycles",
    journal: "J. Heterocyclic Chem. 45. 1775",
    year: 2008,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Indole", "Spiro", "Antimicrobial"],
    abstract:
      "Explores the bioactivity of spiro and fused heterocycles derived from indole-based intermediates.",
  },
  {
    title: "Synthesis of 5-Benzylidene Oxazinones and Pyrimidobenzimidazoles",
    journal: "ARKIVOC 2009 (x) 233-246",
    year: 2009,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Oxazinone", "Pyrimidobenzimidazole", "Bridged Nitrogen"],
    abstract:
      "Discusses efficient routes for creating bridged nitrogen frameworks via condensation of aryl precursors.",
  },
  {
    title: "One Pot Synthesis of Spiro and Quinazoline Derivatives",
    journal: "J. Heterocyclic Chem. 47. 324-333",
    year: 2010,
    authors: ["Dr. Jasbir Singh"],
    tags: ["Spiro", "Quinazoline", "One-pot Synthesis"],
    abstract:
      "Describes a one-pot protocol for diverse spiro and quinazoline-based heterocycles targeting biological relevance.",
  },
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected...");

    await Paper.deleteMany({});
    await Paper.insertMany(papers);

    console.log("✅ Papers seeded successfully.");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });