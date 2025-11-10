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
import ReactionVisualizer from "./pages/ReactionVisualizer";
import CinematicReaction from './pages/CinematicVisualizer';
import ReactionAnimation from './pages/ReactionAnimation';
import PaperUpload from './pages/PaperUpload';
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  return (
    <ErrorBoundary>
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
              <Route path="/visualizer" element={<ReactionVisualizer />} />
              <Route path="/visualizer/synthesis" element={<Visualizer />} />
              <Route path="/submit" element={<SubmitResearch />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/visualizer/reaction1" element={<ReactionVisualizer />} />
              <Route path="/visualizer/cinematic" element={<CinematicReaction />} />
              <Route path="/visualizer/animated" element={<ReactionAnimation />} />
              <Route path="/paper-upload" element={<PaperUpload />} />
            </Routes>
          </main>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;
