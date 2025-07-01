import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Archive = () => {
  const [compounds, setCompounds] = useState([]);
  const [papers, setPapers] = useState([]);
  const [synthesis, setSynthesis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compoundsRes, papersRes, synthesisRes] = await Promise.all([
          axios.get("http://localhost:5001/api/compounds"),
          axios.get("http://localhost:5001/api/papers"),
          axios.get("http://localhost:5001/api/synthesis")
        ]);
        
        setCompounds(compoundsRes.data);
        setPapers(papersRes.data);
        setSynthesis(synthesisRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching archive data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterData = (data, type) => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      const searchFields = type === "compounds" 
        ? [item.name, item.category, item.description]
        : type === "papers"
        ? [item.title, item.abstract, ...(item.authors || [])]
        : [item.name, item.notes];
      
      return searchFields.some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const filteredCompounds = filterData(compounds, "compounds");
  const filteredPapers = filterData(papers, "papers");
  const filteredSynthesis = filterData(synthesis, "synthesis");

  const tabs = [
    { id: "all", label: "All", count: compounds.length + papers.length + synthesis.length },
    { id: "compounds", label: "Compounds", count: compounds.length },
    { id: "papers", label: "Papers", count: papers.length },
    { id: "synthesis", label: "Synthesis Routes", count: synthesis.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading archive...</p>
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
            Research Archive
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive database of compounds, papers, and synthesis routes
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search across all archive content..."
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-xl transition-all duration-300 text-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="text-lg font-semibold">{tab.label}</div>
                <div className={`text-sm ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tab.count} items
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Compounds Section */}
          {(activeTab === "all" || activeTab === "compounds") && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">🧪</span>
                  Compounds
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredCompounds.length} found
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompounds.slice(0, activeTab === "compounds" ? undefined : 6).map(compound => (
                  <Link
                    key={compound._id}
                    to={`/compound/${compound._id}`}
                    className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {compound.name}
                    </h3>
                    <p className="text-sm text-blue-600 mb-2 font-medium">{compound.category}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{compound.description}</p>
                    {compound.tags && compound.tags.length > 0 && (
                      <div className="mt-3 flex gap-1 flex-wrap">
                        {compound.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {compound.tags.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{compound.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
              
              {activeTab === "all" && filteredCompounds.length > 6 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setActiveTab("compounds")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all {filteredCompounds.length} compounds →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Papers Section */}
          {(activeTab === "all" || activeTab === "papers") && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">📄</span>
                  Research Papers
                </h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredPapers.length} found
                </span>
              </div>
              
              <div className="space-y-6">
                {filteredPapers.slice(0, activeTab === "papers" ? undefined : 4).map(paper => (
                  <div key={paper._id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{paper.title}</h3>
                    {paper.authors && paper.authors.length > 0 && (
                      <p className="text-green-600 font-medium mb-3">{paper.authors.join(", ")}</p>
                    )}
                    <p className="text-gray-700 mb-4 line-clamp-3">{paper.abstract}</p>
                    {paper.tags && paper.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {paper.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {paper.tags.length > 4 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{paper.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {activeTab === "all" && filteredPapers.length > 4 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setActiveTab("papers")}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    View all {filteredPapers.length} papers →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Synthesis Routes Section */}
          {(activeTab === "all" || activeTab === "synthesis") && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">⚗️</span>
                  Synthesis Routes
                </h2>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredSynthesis.length} found
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSynthesis.slice(0, activeTab === "synthesis" ? undefined : 4).map(route => (
                  <Link
                    key={route._id}
                    to={`/synthesis/${route._id}`}
                    className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-purple-600 font-medium mb-3">
                      {route.steps?.length || 0} steps
                    </p>
                    {route.notes && (
                      <p className="text-gray-600 text-sm line-clamp-2">{route.notes}</p>
                    )}
                    {route.compoundId && (
                      <div className="mt-3">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Related: {route.compoundId.name || route.compoundId}
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
              
              {activeTab === "all" && filteredSynthesis.length > 4 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setActiveTab("synthesis")}
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View all {filteredSynthesis.length} synthesis routes →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === "compounds" && filteredCompounds.length === 0) ||
            (activeTab === "papers" && filteredPapers.length === 0) ||
            (activeTab === "synthesis" && filteredSynthesis.length === 0) ||
            (activeTab === "all" && filteredCompounds.length === 0 && filteredPapers.length === 0 && filteredSynthesis.length === 0)) && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128v-.001M15 19.128v.001M15 19.128c.5-.636.878-1.446 1.089-2.391l.001-.017c.09-.365-.042-.727-.357-.99A7.967 7.967 0 0112 15c-2.34 0-4.29.82-5.877 2.172" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search terms or browse different categories.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Archive;
