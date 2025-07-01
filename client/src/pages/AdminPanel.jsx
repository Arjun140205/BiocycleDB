import { useState } from "react";
import CompoundForm from "../components/CompoundForm";
import PaperForm from "../components/PaperForm";
import SynthesisForm from "../components/SynthesisForm";

const AdminPanel = () => {
  const [tab, setTab] = useState("compound");

  const tabs = [
    { id: "compound", label: "Compound", icon: "🧪", description: "Add new chemical compounds" },
    { id: "paper", label: "Paper", icon: "📄", description: "Upload research papers" },
    { id: "synthesis", label: "Synthesis", icon: "⚗️", description: "Create synthesis routes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Upload Panel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage and upload content to the BioCycleDB database
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`p-6 rounded-xl transition-all duration-300 text-left ${
                  tab === tabItem.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{tabItem.icon}</span>
                  <h3 className="text-xl font-semibold">{tabItem.label}</h3>
                </div>
                <p className={`text-sm ${tab === tabItem.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tabItem.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {tabs.find(t => t.id === tab)?.label} Upload
            </h2>
            <p className="text-gray-600">
              {tabs.find(t => t.id === tab)?.description}
            </p>
          </div>

          <div className="max-w-4xl">
            {tab === "compound" && <CompoundForm />}
            {tab === "paper" && <PaperForm />}
            {tab === "synthesis" && <SynthesisForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;