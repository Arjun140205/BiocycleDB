import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
          BioCycleDB: Visualize Chemistry in Motion
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          An interactive platform to explore real heterocyclic chemistry research through
          animated synthesis pathways, live molecule visualization, and human-readable
          explanations — starting with the legacy of Dr. Jasbir Singh.
        </p>
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Link to="/visualizer" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            🧬 Launch Visualizer
          </Link>
          <Link to="/archive" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100">
            📚 Browse Research Archive
          </Link>
          <Link to="/paper-upload" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded hover:from-purple-700 hover:to-pink-700">
            🤖 AI Paper Upload
          </Link>
          <Link to="/submit" className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-100">
            ➕ Contribute Research
          </Link>
        </div>
      </div>

      <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          title="Interactive Synthesis Viewer"
          emoji="🧪"
          desc="Watch synthesis steps animate in real-time, just like sorting visualizers — each step, reagent, and condition mapped visually."
        />
        <FeatureCard
          title="Molecule Engine"
          emoji="🧬"
          desc="See 3D structure updates with each step using 3Dmol.js and SMILES strings — compare before/after live."
        />
        <FeatureCard
          title="AI Paper Parser"
          emoji="🤖"
          desc="Upload PDF research papers and let AI automatically extract compounds, SMILES structures, and synthesis routes."
        />
        <FeatureCard
          title="Research Archive + Contributions"
          emoji="📚"
          desc="Showcase real published work and allow others to contribute their own synthesis routes for heterocycles."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ emoji, title, desc }) => (
  <div className="bg-gray-50 border p-6 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-xl font-semibold mb-2">{emoji} {title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

export default Home;