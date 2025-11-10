import { useState } from "react";
import axios from "axios";

const PaperUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Editable extracted data
  const [editablePaper, setEditablePaper] = useState(null);
  const [editableCompounds, setEditableCompounds] = useState([]);
  const [editableSynthesis, setEditableSynthesis] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleUploadAndParse = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setUploading(true);
    setParsing(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/paper-upload/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setParsedData(response.data);
      setExtractedText(response.data.extractedText);
      
      // Set editable data
      setEditablePaper(response.data.extractedData.paper);
      setEditableCompounds(response.data.extractedData.compounds || []);
      setEditableSynthesis(response.data.extractedData.synthesisRoutes || []);
      
      setUploading(false);
      setParsing(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload and parse PDF');
      setUploading(false);
      setParsing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/paper-upload/save', {
        paperData: editablePaper,
        compounds: editableCompounds,
        synthesisRoutes: editableSynthesis,
        pdfPath: `/uploads/papers/${parsedData.filename}`
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(true);
      setSaving(false);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setParsedData(null);
        setFile(null);
        setEditablePaper(null);
        setEditableCompounds([]);
        setEditableSynthesis([]);
      }, 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save data to database');
      setSaving(false);
    }
  };

  const updatePaperField = (field, value) => {
    setEditablePaper(prev => ({ ...prev, [field]: value }));
  };

  const updateCompound = (index, field, value) => {
    const updated = [...editableCompounds];
    updated[index][field] = value;
    setEditableCompounds(updated);
  };

  const removeCompound = (index) => {
    setEditableCompounds(prev => prev.filter((_, i) => i !== index));
  };

  const addCompound = () => {
    setEditableCompounds(prev => [...prev, {
      name: "",
      category: "",
      description: "",
      possibleSMILES: ""
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📄 AI-Powered Paper Upload
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a research paper PDF and let AI extract compounds, synthesis routes, and metadata automatically
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center space-x-3">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center space-x-3">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="text-sm text-green-700">Paper and extracted data saved to database successfully!</p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {!parsedData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Upload PDF</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors duration-200">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {file ? file.name : 'Click to upload PDF'}
                </p>
                <p className="text-sm text-gray-500">
                  PDF files up to 10MB
                </p>
              </label>
            </div>

            {file && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleUploadAndParse}
                  disabled={uploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{parsing ? 'AI is analyzing...' : 'Uploading...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <span>Upload & Parse with AI</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Parsed Data Preview & Edit */}
        {parsedData && editablePaper && (
          <div className="space-y-8">
            {/* Paper Metadata */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Review & Edit Paper Metadata</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editablePaper.title || ""}
                    onChange={(e) => updatePaperField('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Authors (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editablePaper.authors) ? editablePaper.authors.join(', ') : editablePaper.authors || ""}
                    onChange={(e) => updatePaperField('authors', e.target.value.split(',').map(a => a.trim()))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
                  <textarea
                    value={editablePaper.abstract || ""}
                    onChange={(e) => updatePaperField('abstract', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Journal</label>
                    <input
                      type="text"
                      value={editablePaper.journal || ""}
                      onChange={(e) => updatePaperField('journal', e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={editablePaper.year || ""}
                      onChange={(e) => updatePaperField('year', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Compounds */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Extracted Compounds ({editableCompounds.length})</h2>
                <button
                  onClick={addCompound}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Compound</span>
                </button>
              </div>

              <div className="space-y-4">
                {editableCompounds.map((compound, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Compound {index + 1}</h3>
                      <button
                        onClick={() => removeCompound(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={compound.name || ""}
                          onChange={(e) => updateCompound(index, 'name', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={compound.category || ""}
                          onChange={(e) => updateCompound(index, 'category', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMILES</label>
                        <input
                          type="text"
                          value={compound.possibleSMILES || compound.smiles || ""}
                          onChange={(e) => updateCompound(index, 'possibleSMILES', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="e.g., CC(=O)Oc1ccccc1C(=O)O"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={compound.description || ""}
                          onChange={(e) => updateCompound(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Synthesis Routes */}
            {editableSynthesis.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Extracted Synthesis Routes ({editableSynthesis.length})</h2>
                
                <div className="space-y-6">
                  {editableSynthesis.map((route, routeIndex) => (
                    <div key={routeIndex} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{route.name}</h3>
                      <div className="space-y-3">
                        {route.steps?.map((step, stepIndex) => (
                          <div key={stepIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {step.stepNumber}
                              </div>
                              <span className="font-medium text-gray-900">Step {step.stepNumber}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><span className="font-medium">From:</span> {step.from}</div>
                              <div><span className="font-medium">To:</span> {step.to}</div>
                              <div><span className="font-medium">Reagent:</span> {step.reagent}</div>
                              <div><span className="font-medium">Conditions:</span> {step.conditions}</div>
                              {step.description && (
                                <div className="col-span-2"><span className="font-medium">Description:</span> {step.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Text Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Extracted Text Preview</h2>
              <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{extractedText}</pre>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Showing first 2000 characters • Total pages: {parsedData.pageCount}
              </p>
            </div>

            {/* Save Button */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to save?</h3>
                  <p className="text-gray-600">This will create {editableCompounds.length} compounds and {editableSynthesis.length} synthesis routes</p>
                </div>
                <button
                  onClick={handleSaveToDatabase}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span>Save to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperUpload;
