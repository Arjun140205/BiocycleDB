import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TimelineView = () => {
  const [groupedPapers, setGroupedPapers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/papers");
        
        if (response.data.length === 0) {
          setError("No papers found in the database.");
          setLoading(false);
          return;
        }

        const papersByYear = {};
        response.data.forEach(paper => {
          const year = paper.year || "Unknown";
          if (!papersByYear[year]) papersByYear[year] = [];
          papersByYear[year].push(paper);
        });

        // Sort years descending
        const sorted = Object.fromEntries(
          Object.entries(papersByYear).sort((a, b) => b[0] - a[0])
        );

        setGroupedPapers(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError(`Failed to load papers: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Research Timeline</h1>
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading papers...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <div className="text-red-700">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && Object.keys(groupedPapers).length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-yellow-800 text-lg font-semibold mb-2">No Papers Found</div>
            <div className="text-yellow-700 mb-4">There are no research papers in the database yet.</div>
            <Link 
              to="/submit-research" 
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Submit First Paper
            </Link>
          </div>
        )}

        {!loading && !error && Object.entries(groupedPapers).map(([year, papers]) => (
          <div key={year} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-indigo-200 pb-2">
              {year}
            </h2>
            <div className="space-y-6">
              {papers.map(paper => (
                <div key={paper._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{paper.title}</h3>
                  <p className="text-sm text-gray-600 italic mb-3">
                    {paper.authors?.length > 0 ? paper.authors.join(", ") : "No authors listed"}
                  </p>
                  {paper.journal && (
                    <p className="text-sm text-blue-600 mb-2">
                      <strong>Journal:</strong> {paper.journal}
                    </p>
                  )}
                  {paper.abstract && (
                    <p className="text-gray-700 mb-4 leading-relaxed">{paper.abstract}</p>
                  )}
                  {paper.tags && paper.tags.length > 0 && (
                    <div className="mb-3">
                      <strong className="text-sm text-gray-600">Tags:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {paper.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {paper.relatedCompounds && paper.relatedCompounds.length > 0 && (
                    <div className="mb-3">
                      <strong className="text-sm text-gray-600">Related Compounds:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {paper.relatedCompounds.map(comp => (
                          <Link 
                            key={comp._id} 
                            to={`/compound/${comp._id}`} 
                            className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded hover:bg-purple-200 transition-colors"
                          >
                            {comp.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {paper.link && (
                    <a 
                      href={paper.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                    >
                      View Paper
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;