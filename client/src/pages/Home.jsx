import { Link } from "react-router-dom";
import { 
  FiEye, 
  FiDatabase, 
  FiUploadCloud, 
  FiZap,
  FiBox,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiArrowRight
} from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FiZap className="w-4 h-4" />
              <span>AI-Powered Chemistry Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-secondary-900 mb-6 tracking-tight">
              Explore Chemistry
              <span className="block gradient-text">In Motion</span>
            </h1>
            
            <p className="text-xl text-secondary-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Interactive platform for visualizing heterocyclic chemistry research through 
              animated synthesis pathways and AI-powered analysis.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/visualizer" 
                className="group inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-700 shadow-soft hover:shadow-medium transition-all"
              >
                <FiEye className="w-5 h-5" />
                <span>Launch Visualizer</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/archive" 
                className="inline-flex items-center space-x-2 bg-white text-secondary-900 px-6 py-3.5 rounded-xl font-semibold border border-secondary-200 hover:border-secondary-300 hover:shadow-soft transition-all"
              >
                <FiDatabase className="w-5 h-5" />
                <span>Browse Archive</span>
              </Link>
              
              <Link 
                to="/paper-upload" 
                className="inline-flex items-center space-x-2 bg-white text-secondary-900 px-6 py-3.5 rounded-xl font-semibold border border-secondary-200 hover:border-secondary-300 hover:shadow-soft transition-all"
              >
                <FiUploadCloud className="w-5 h-5" />
                <span>AI Upload</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Everything you need to explore, analyze, and contribute to chemistry research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={FiEye}
            title="Interactive Synthesis"
            description="Watch synthesis steps animate in real-time with detailed reagent mapping."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={FiBox}
            title="3D Molecules"
            description="Visualize molecular structures in 3D using SMILES notation."
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={FiUploadCloud}
            title="AI Parser"
            description="Upload PDFs and extract compounds, SMILES, and synthesis routes automatically."
            gradient="from-green-500 to-emerald-500"
          />
          <FeatureCard
            icon={FiDatabase}
            title="Research Archive"
            description="Comprehensive database with full-text search and filtering."
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-y border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={FiBox} number="500+" label="Compounds" />
            <StatCard icon={FiFileText} number="200+" label="Papers" />
            <StatCard icon={FiTrendingUp} number="150+" label="Synthesis Routes" />
            <StatCard icon={FiUsers} number="50+" label="Contributors" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 shadow-large">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to explore chemistry?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Start visualizing synthesis pathways, exploring compounds, or contribute your own research.
            </p>
            <Link 
              to="/compounds" 
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 shadow-soft hover:shadow-medium transition-all"
            >
              <span>Get Started</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group relative bg-white rounded-2xl p-6 border border-secondary-200 hover:border-secondary-300 hover:shadow-medium transition-all">
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
    <p className="text-sm text-secondary-600 leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ icon: Icon, number, label }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl mb-3">
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
    <div className="text-3xl font-bold text-secondary-900 mb-1">{number}</div>
    <div className="text-sm text-secondary-600 font-medium">{label}</div>
  </div>
);

export default Home;
