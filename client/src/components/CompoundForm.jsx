import { useState } from "react";
import axios from "axios";

const CompoundForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    iupacName: "",
    smiles: "",
    category: "",
    bioactivity: "",
    description: "",
    tags: "",
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
      bioactivity: formData.bioactivity.split(",").map(b => b.trim()),
      tags: formData.tags.split(",").map(t => t.trim()),
    };
    
    try {
      await axios.post("http://localhost:5001/api/compounds", payload);
      setSuccess(true);
      setFormData({ 
        name: "", 
        iupacName: "", 
        smiles: "", 
        category: "", 
        bioactivity: "", 
        description: "", 
        tags: "" 
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Error adding compound");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Compound Name", type: "text", required: true, placeholder: "Enter compound name" },
    { name: "iupacName", label: "IUPAC Name", type: "text", required: false, placeholder: "Enter IUPAC name" },
    { name: "smiles", label: "SMILES String", type: "text", required: true, placeholder: "Enter SMILES notation" },
    { name: "category", label: "Category", type: "text", required: false, placeholder: "e.g., alkaloid, antibiotic" },
    { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Describe the compound..." },
    { name: "bioactivity", label: "Bioactivity", type: "text", required: false, placeholder: "Comma-separated bioactivities" },
    { name: "tags", label: "Tags", type: "text", required: false, placeholder: "Comma-separated tags" },
  ];

  return (
    <div className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">Success!</h3>
            <p className="text-sm text-green-700">Compound has been added successfully.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className={field.name === 'description' ? 'lg:col-span-2' : ''}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
              {(field.name === 'tags' || field.name === 'bioactivity') && (
                <p className="mt-1 text-sm text-gray-500">Separate multiple entries with commas</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Fields marked with <span className="text-red-500">*</span> are required
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Compound</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompoundForm;