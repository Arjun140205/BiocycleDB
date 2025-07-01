import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompoundExplorer = () => {
  const [compounds, setCompounds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/compounds")
      .then(res => {
        setCompounds(res.data);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading compounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Compound Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and explore chemical compounds from our comprehensive database
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm bg-opacity-90">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Compounds
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, category, or description..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Tags Filter */}
            <div className="lg:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Tags
              </label>
              <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                {allTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filtered.length}</span> of {compounds.length} compounds
            </p>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Compounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(comp => (
            <div key={comp._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {comp.name}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {comp.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {comp.description}
                </p>
                
                {/* Tags */}
                {comp.tags && comp.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {comp.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                    {comp.tags.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                        +{comp.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* View Details Button */}
                <Link
                  to={`/compound/${comp._id}`}
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <span>View Details</span>
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128v-.001M15 19.128v.001M15 19.128c.5-.636.878-1.446 1.089-2.391l.001-.017c.09-.365-.042-.727-.357-.99A7.967 7.967 0 0112 15c-2.34 0-4.29.82-5.877 2.172" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No compounds found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search terms or clearing the filters.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundExplorer;