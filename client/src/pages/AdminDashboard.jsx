import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

const AdminDashboard = () => {
  const [compounds, setCompounds] = useState([]);
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/compounds")
      .then(res => setCompounds(res.data));
    axios.get("http://localhost:5001/api/papers")
      .then(res => setPapers(res.data));
  }, []);

  const categoryCount = compounds.reduce((acc, c) => {
    const cat = c.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const bioactivities = [...new Set(compounds.flatMap(c => c.bioactivity || []))];

  const pieData = Object.entries(categoryCount).map(([key, value]) => ({ name: key, value }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-blue-100 p-6 rounded shadow">
          <p className="text-xl font-bold">{compounds.length}</p>
          <p className="text-gray-700">Total Compounds</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow">
          <p className="text-xl font-bold">{papers.length}</p>
          <p className="text-gray-700">Total Papers</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded shadow">
          <p className="text-xl font-bold">{bioactivities.length}</p>
          <p className="text-gray-700">Unique Bioactivities</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Compounds by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;