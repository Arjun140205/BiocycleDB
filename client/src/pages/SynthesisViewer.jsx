import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SynthesisViewer = () => {
  const { id } = useParams();
  const [synthesis, setSynthesis] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/synthesis/${id}`)
      .then(res => {
        setSynthesis(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAIExplain = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:5001/api/ai/explain", {
        steps: synthesis.steps
      });
      setAiExplanation(res.data.explanation);
    } catch (err) {
      alert("AI failed to explain this route.");
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading synthesis data...</p>
        </div>
      </div>
    );
  }

  if (!synthesis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Synthesis not found</h2>
          <p className="text-gray-600 mb-4">The requested synthesis route could not be found.</p>
          <Link
            to="/compounds"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Browse Compounds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{synthesis.name}</h1>
              {synthesis.compoundId && (
                <p className="text-lg text-gray-600">
                  Linked Compound:{" "}
                  <Link
                    to={`/compound/${synthesis.compoundId._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    {synthesis.compoundId.name}
                  </Link>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {synthesis.steps?.length || 0} Steps
              </span>
            </div>
          </div>

          {/* Visual Diagram */}
          {synthesis.visual && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Synthesis Diagram</h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <img
                  src={synthesis.visual}
                  alt="Synthesis Diagram"
                  className="rounded-lg shadow-md max-w-full h-auto mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Reaction Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Reaction Steps</h2>
          <div className="space-y-6">
            {synthesis.steps?.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Step {idx + 1}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Starting Material</label>
                      <p className="text-gray-900 font-mono text-sm">{step.from}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                      <p className="text-gray-900 font-mono text-sm">{step.to}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reagent</label>
                      <p className="text-gray-900 font-mono text-sm">{step.reagent}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
                      <p className="text-gray-900 font-mono text-sm">{step.conditions}</p>
                    </div>
                  </div>
                  
                  {step.description && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                    </div>
                  )}
                </div>
                
                {/* Arrow between steps */}
                {idx < synthesis.steps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        {synthesis.notes && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Notes</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-yellow-800 leading-relaxed">{synthesis.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Explanation Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">AI Analysis</h3>
            <button
              onClick={handleAIExplain}
              disabled={loadingAI}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              {loadingAI ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🧠</span>
                  <span>Simplify Synthesis</span>
                </>
              )}
            </button>
          </div>

          {aiExplanation && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Summary</h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!aiExplanation && !loadingAI && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <p className="text-gray-600">
                Click the button above to get an AI-powered explanation of this synthesis route
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynthesisViewer;