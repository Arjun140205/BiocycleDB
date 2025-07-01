import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompoundExplorer from "./pages/CompoundExplorer";
import PaperArchive from "./pages/PaperArchive";
import SynthesisViewer from "./pages/SynthesisViewer";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import CompoundDetails from "./pages/CompoundDetails";
import GraphView from "./pages/GraphView";
import AdminDashboard from "./pages/AdminDashboard";
import TimelineView from "./pages/TimelineView";
import NavBar from "./components/NavBar";
import Visualizer from "./pages/Visualizer";
import SubmitResearch from "./pages/SubmitResearch";
import Archive from "./pages/Archive";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Router>
        <NavBar />
        <main className="min-h-screen pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compounds" element={<CompoundExplorer />} />
            <Route path="/papers" element={<PaperArchive />} />
            <Route path="/synthesis/:id" element={<SynthesisViewer />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/compound/:id" element={<CompoundDetails />} />
            <Route path="/graph" element={<GraphView />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/timeline" element={<TimelineView />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/submit" element={<SubmitResearch />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;