import { useState } from "react";
import axios from "axios";

const PaperForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    abstract: "",
    journal: "",
    year: "",
    link: "",
    pdfUrl: "",
    relatedCompounds: "",
    tags: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      authors: formData.authors.split(",").map(a => a.trim()),
      tags: formData.tags.split(",").map(t => t.trim()),
      relatedCompounds: formData.relatedCompounds.split(",").map(id => id.trim()),
    };
    try {
      await axios.post("http://localhost:5001/api/papers", payload);
      alert("Paper added!");
      setFormData({
        title: "", authors: "", abstract: "", journal: "",
        year: "", link: "", pdfUrl: "", relatedCompounds: "", tags: ""
      });
    } catch (err) {
      alert("Error adding paper");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {["title", "authors", "abstract", "journal", "year", "link", "pdfUrl", "relatedCompounds", "tags"].map((field) => (
        <div key={field}>
          <label className="block font-medium">{field}</label>
          <input
            type={field === "year" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder={
              ["authors", "tags", "relatedCompounds"].includes(field)
                ? "comma-separated"
                : ""
            }
            required={["title", "abstract", "year"].includes(field)}
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Paper</button>
    </form>
  );
};

export default PaperForm;