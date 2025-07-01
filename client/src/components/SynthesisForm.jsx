import { useState } from "react";
import axios from "axios";

const SynthesisForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    compoundId: "",
    visual: "",
    notes: "",
    steps: [{ stepNumber: 1, from: "", to: "", description: "", reagent: "", conditions: "" }],
  });

  const handleStepChange = (index, e) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index][e.target.name] = e.target.value;
    setFormData(prev => ({ ...prev, steps: updatedSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { stepNumber: prev.steps.length + 1, from: "", to: "", description: "", reagent: "", conditions: "" }]
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/synthesis", formData);
      alert("Synthesis route added!");
      setFormData({
        name: "",
        compoundId: "",
        visual: "",
        notes: "",
        steps: [{ stepNumber: 1, from: "", to: "", description: "", reagent: "", conditions: "" }],
      });
    } catch (err) {
      alert("Error adding synthesis route");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {["name", "compoundId", "visual", "notes"].map((field) => (
        <div key={field}>
          <label className="block font-medium">{field}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder={field === "compoundId" ? "linked Compound _id" : ""}
            required={["name", "compoundId"].includes(field)}
          />
        </div>
      ))}

      <h3 className="text-lg font-semibold mt-4">Synthesis Steps</h3>
      {formData.steps.map((step, index) => (
        <div key={index} className="border p-3 rounded bg-gray-100 mb-4">
          <label className="block font-semibold mb-1">Step {index + 1}</label>
          {["from", "to", "description", "reagent", "conditions"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={step[field]}
              onChange={(e) => handleStepChange(index, e)}
              placeholder={field}
              className="w-full mb-2 border rounded p-2"
            />
          ))}
        </div>
      ))}

      <button type="button" onClick={addStep} className="px-3 py-1 bg-yellow-500 text-white rounded">+ Add Step</button>
      <button type="submit" className="ml-4 px-4 py-2 bg-purple-600 text-white rounded">Submit Synthesis</button>
    </form>
  );
};

export default SynthesisForm;