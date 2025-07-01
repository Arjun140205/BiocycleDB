import { useState } from "react";
import axios from "axios";

const SubmitResearch = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    abstract: "",
    keywords: "",
    researchType: "synthesis",
    compounds: "",
    methodology: "",
    results: "",
    conclusions: "",
    references: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    const payload = {
      ...formData,
      authors: formData.authors.split(",").map(a => a.trim()),
      keywords: formData.keywords.split(",").map(k => k.trim()),
      compounds: formData.compounds.split(",").map(c => c.trim()),
      references: formData.references.split(",").map(r => r.trim()),
    };
    
    try {
      await axios.post("http://localhost:5001/api/research", payload);
      setSuccess(true);
      setFormData({
        title: "",
        authors: "",
        abstract: "",
        keywords: "",
        researchType: "synthesis",
        compounds: "",
        methodology: "",
        results: "",
        conclusions: "",
        references: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Error submitting research");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Submit Research
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your research findings with the scientific community
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="text-sm text-green-700">Your research has been submitted successfully.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Research Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your research title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
                    Authors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="authors"
                    name="authors"
                    value={formData.authors}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Comma-separated author names"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="researchType" className="block text-sm font-medium text-gray-700 mb-2">
                    Research Type
                  </label>
                  <select
                    id="researchType"
                    name="researchType"
                    value={formData.researchType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="synthesis">Chemical Synthesis</option>
                    <option value="analysis">Chemical Analysis</option>
                    <option value="bioactivity">Bioactivity Study</option>
                    <option value="computational">Computational Chemistry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Abstract
              </h2>
              
              <div>
                <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="abstract"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Provide a detailed abstract of your research..."
                  required
                />
              </div>
            </div>

            {/* Research Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Research Details
              </h2>

              <div>
                <label htmlFor="compounds" className="block text-sm font-medium text-gray-700 mb-2">
                  Compounds Studied
                </label>
                <input
                  type="text"
                  id="compounds"
                  name="compounds"
                  value={formData.compounds}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Comma-separated compound names or IDs"
                />
              </div>

              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                  Methodology
                </label>
                <textarea
                  id="methodology"
                  name="methodology"
                  value={formData.methodology}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe your research methodology..."
                />
              </div>

              <div>
                <label htmlFor="results" className="block text-sm font-medium text-gray-700 mb-2">
                  Results
                </label>
                <textarea
                  id="results"
                  name="results"
                  value={formData.results}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Summarize your key findings..."
                />
              </div>

              <div>
                <label htmlFor="conclusions" className="block text-sm font-medium text-gray-700 mb-2">
                  Conclusions
                </label>
                <textarea
                  id="conclusions"
                  name="conclusions"
                  value={formData.conclusions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="State your conclusions..."
                />
              </div>

              <div>
                <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-2">
                  References
                </label>
                <textarea
                  id="references"
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Comma-separated references or citations..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Fields marked with <span className="text-red-500">*</span> are required
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Submit Research</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitResearch;
