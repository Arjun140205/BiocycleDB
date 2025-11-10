import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiSearch, FiFilter, FiX, FiArrowRight } from "react-icons/fi";

const CompoundExplorer = () => {
  const [compounds, setCompounds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/compounds")
      .then(res => {
        const data = res.data.compounds || res.data;
        setCompounds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const allTags = [...new Set(compounds.flatMap(c => c.tags || []))];

  const filtered = compounds.filter(compound => {
    const matchText = [compound.name, compound.category, compound.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchTags = selectedTags.length === 0 || selectedTags.every(tag => compound.tags?.includes(tag));

    return matchText && matchTags;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading compounds..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-3">
            Compound Explorer
          </h1>
          <p className="text-lg text-secondary-600">
            Discover and explore chemical compounds from our comprehensive database
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-secondary-200 p-6 mb-8 shadow-soft">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-semibold text-secondary-900 mb-2">
                Search Compounds
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, category, or description..."
                  className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-900 placeholder-secondary-400"
                />
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="lg:w-1/3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-secondary-900">
                    <FiFilter className="inline w-4 h-4 mr-1" />
                    Filter by Tags
                  </label>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {allTags.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-primary-600 text-white shadow-soft"
                          : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                      }`}
                    >
                      <span>{tag}</span>
                      {selectedTags.includes(tag) && <FiX className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-600">
              Showing <span className="font-semibold text-secondary-900">{filtered.length}</span> of {compounds.length} compounds
            </p>
          </div>
        </div>

        {/* Compounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(comp => (
            <Link
              key={comp._id}
              to={`/compound/${comp._id}`}
              className="group bg-white rounded-2xl border border-secondary-200 p-6 hover:border-primary-300 hover:shadow-medium transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {comp.name}
                </h3>
                {comp.category && (
                  <span className="ml-2 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg whitespace-nowrap">
                    {comp.category}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-secondary-600 mb-4 line-clamp-3 leading-relaxed">
                {comp.description || "No description available"}
              </p>
              
              {/* Tags */}
              {comp.tags && comp.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {comp.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {comp.tags.length > 3 && (
                    <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded">
                      +{comp.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <FiArrowRight className="ml-1 w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiSearch className="w-10 h-10 text-secondary-400" />
            </div>
            <h3 className="text-2xl font-semibold text-secondary-900 mb-2">No compounds found</h3>
            <p className="text-secondary-600 mb-6">Try adjusting your search terms or clearing the filters.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
              }}
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 shadow-soft transition-all"
            >
              <FiX className="w-4 h-4" />
              <span>Reset Search</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundExplorer;
