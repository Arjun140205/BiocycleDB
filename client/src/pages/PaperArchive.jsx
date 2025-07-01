import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PaperArchive = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/papers")
      .then(res => {
        setPapers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const allTags = [...new Set(papers.flatMap(p => p.tags || []))];

  const filtered = papers.filter(paper => {
    const matchText = [paper.title, paper.abstract, ...(paper.authors || [])]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchTags = selectedTags.length === 0 || selectedTags.every(tag => paper.tags?.includes(tag));

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
          <p className="text-gray-600 text-lg">Loading research papers...</p>
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
            Explore cutting-edge research papers in organic chemistry and synthesis
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Papers
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
                  placeholder="Search by title, abstract, or authors..."
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

          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filtered.length}</span> of {papers.length} papers
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

        {/* Papers List */}
        <div className="space-y-8">
          {filtered.map((paper) => (
            <div key={paper._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                      {paper.title}
                    </h2>
                    {paper.authors && paper.authors.length > 0 && (
                      <p className="text-lg text-blue-600 font-medium mb-4">
                        {paper.authors.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {paper.pdfUrl && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        PDF Available
                      </span>
                    )}
                    {paper.link && !paper.pdfUrl && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        External Link
                      </span>
                    )}
                  </div>
                </div>

                {/* Abstract */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Abstract</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {paper.abstract}
                  </p>
                </div>

                {/* Tags */}
                {paper.tags && paper.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords</h4>
                    <div className="flex gap-2 flex-wrap">
                      {paper.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Compounds */}
                {paper.relatedCompounds && paper.relatedCompounds.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Related Compounds</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {paper.relatedCompounds.map((comp) => (
                        <Link
                          key={comp._id}
                          to={`/compound/${comp._id}`}
                          className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-purple-700 hover:text-purple-900 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <span className="text-lg">🧪</span>
                          <span className="font-medium">{comp.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF Viewer or External Link */}
                {paper.pdfUrl && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Document</h4>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <iframe
                        src={paper.pdfUrl}
                        width="100%"
                        height="500px"
                        className="rounded-lg border border-gray-300"
                        title={paper.title}
                      ></iframe>
                    </div>
                  </div>
                )}

                {paper.link && !paper.pdfUrl && (
                  <div className="flex justify-center">
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <span>View Full Paper</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128v-.001M15 19.128v.001M15 19.128c.5-.636.878-1.446 1.089-2.391l.001-.017c.09-.365-.042-.727-.357-.99A7.967 7.967 0 0112 15c-2.34 0-4.29.82-5.877 2.172" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No papers found</h3>
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

export default PaperArchive;