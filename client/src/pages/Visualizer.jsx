import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as $3Dmol from "3dmol";

const Visualizer = () => {
  const [routes, setRoutes] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const viewerRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:5001/api/synthesis")
      .then(res => {
        setRoutes(res.data);
        if (res.data.length > 0) {
          setCurrentRoute(res.data[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (currentRoute && currentRoute.steps.length > 0) {
      const currentStep = currentRoute.steps[stepIndex];
      if (currentStep?.to && viewerRef.current) {
        viewerRef.current.innerHTML = "";
        const viewer = $3Dmol.createViewer(viewerRef.current, { backgroundColor: "white" });
        $3Dmol.download("smiles:" + currentStep.to, viewer, {}, () => {
          viewer.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
          viewer.zoomTo();
          viewer.render();
        });
      }
    }
  }, [currentRoute, stepIndex]);

  const goNext = () => {
    if (stepIndex < currentRoute.steps.length - 1) setStepIndex(stepIndex + 1);
  };

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  if (!currentRoute) return <p className="p-6">Loading synthesis route...</p>;
  const step = currentRoute.steps[stepIndex];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Route Selector */}
      {routes.length > 1 && (
        <div className="col-span-full mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Synthesis Route:
          </label>
          <select
            value={currentRoute._id}
            onChange={(e) => {
              const selected = routes.find(r => r._id === e.target.value);
              setCurrentRoute(selected);
              setStepIndex(0);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.name} ({route.steps?.length || 0} steps)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Left - Molecule + Controls */}
      <div className="col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">{currentRoute.name}</h2>
          <div className="flex gap-3 mb-3">
            <button onClick={goPrev} className="bg-gray-300 px-4 py-1 rounded">◀ Prev</button>
            <button onClick={goNext} className="bg-blue-600 text-white px-4 py-1 rounded">Next ▶</button>
          </div>
          <div ref={viewerRef} className="w-full h-[400px] border rounded" />
        </div>

        {/* Step Details */}
        <div className="bg-gray-50 border p-4 rounded shadow">
          <h3 className="font-semibold mb-1">Step {stepIndex + 1} / {currentRoute.steps.length}</h3>
          <p><strong>From:</strong> {step.from}</p>
          <p><strong>To:</strong> {step.to}</p>
          <p><strong>Reagent:</strong> {step.reagent}</p>
          <p><strong>Conditions:</strong> {step.conditions}</p>
          <p className="mt-2 text-sm text-gray-600">{step.description}</p>
        </div>
      </div>

      {/* Right - Metadata */}
      <div className="bg-white border p-4 rounded shadow space-y-3">
        <h3 className="text-lg font-semibold text-blue-800">Synthesis Info</h3>
        <p><strong>Compound:</strong> {currentRoute.compoundId?.name}</p>
        <p><strong>Notes:</strong> {currentRoute.notes || "—"}</p>

        <div className="mt-4">
          <h4 className="font-medium">Linked Paper:</h4>
          {currentRoute.compoundId?.relatedPapers?.map((paper, i) => (
            <div key={i} className="mt-2 text-sm">
              <p className="font-semibold">{paper.title}</p>
              <p className="text-gray-600">{paper.authors?.join(", ")}</p>
              <p className="text-xs mt-1">{paper.abstract}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;