import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

const ReactionVisualizer = () => {
  const [step, setStep] = useState(0);
  const viewerRef = useRef();

  const steps = useMemo(() => [
    {
      title: "Reactant: 2-Aminobenzamide",
      smiles: "NC(=O)c1ccccc1N",
      description:
        "This is the starting molecule: 2-aminobenzamide, a benzene ring with two functional groups — amine and amide. It serves as the core scaffold for building quinazoline-based structures."
    },
    {
      title: "Reagent Added: Formic Acid",
      smiles: "NC(=O)c1ccccc1N", // same for intermediate
      reagent: "Formic Acid",
      description:
        "Formic acid (or hydrazine derivatives) acts as the condensation reagent, promoting ring closure to generate a triazole-fused heterocycle."
    },
    {
      title: "Product: Triazolo-Quinazoline",
      smiles: "c1ccc2nc3nncnc3nc2c1",
      description:
        "Final product: a fused 1,2,4-triazolo[1,5-a]quinazoline — a complex bioactive heterocycle often explored for CNS activity."
    }
  ], []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (window.$3Dmol && viewerRef.current) {
        const container = viewerRef.current;

        // Clear container HTML
        container.innerHTML = "";

        try {
          const viewer = window.$3Dmol.createViewer(container, {
            backgroundColor: "white",
            width: container.clientWidth,
            height: container.clientHeight
          });

          if (!viewer) {
            console.error("3Dmol viewer not initialized.");
            showFallback(container);
            return;
          }

          // Use pre-defined molecular structures instead of SMILES
          const sdfData = getMoleculeData(step);
          
          if (sdfData) {
            console.log("Loading pre-defined molecular structure for step", step);
            viewer.addModel(sdfData, "sdf");
            viewer.setStyle({}, { 
              stick: { radius: 0.2, colorscheme: 'default' }, 
              sphere: { scale: 0.3, colorscheme: 'default' } 
            });
            viewer.zoomTo();
            viewer.render();
            console.log("Molecule rendered successfully");
          } else {
            console.warn("No molecular data available for step", step);
            showFallback(container);
          }

        } catch (error) {
          console.error("Error creating 3Dmol viewer:", error);
          showFallback(container);
        }
      } else {
        console.warn("3Dmol or container not ready");
        if (viewerRef.current) {
          showFallback(viewerRef.current);
        }
      }
    }, 200);

    const getMoleculeData = (stepIndex) => {
      // Pre-defined SDF molecular structures
      const molecules = {
        0: `2-aminobenzamide
  Mrv2014 

  8  8  0  0  0  0            999 V2000
   -1.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7321    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8660   -1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.8660   -1.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  5  6  2  0  0  0  0
  6  1  1  0  0  0  0
  4  7  1  0  0  0  0
  5  8  1  0  0  0  0
M  END`,
        1: `intermediate
  Mrv2014 

  9  9  0  0  0  0            999 V2000
   -1.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7321    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8660   -1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.8660   -1.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    1.5000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  5  6  2  0  0  0  0
  6  1  1  0  0  0  0
  4  7  1  0  0  0  0
  5  8  1  0  0  0  0
  7  9  2  0  0  0  0
M  END`,
        2: `triazolo-quinazoline
  Mrv2014 

 12 13  0  0  0  0            999 V2000
   -2.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0000    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0000   -1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.0000    1.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    1.0000   -1.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000   -0.5000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    3.0000    1.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    3.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  5  6  2  0  0  0  0
  6  1  1  0  0  0  0
  4  7  1  0  0  0  0
  5  8  1  0  0  0  0
  7  9  2  0  0  0  0
  8 10  1  0  0  0  0
  9 10  1  0  0  0  0
  9 11  1  0  0  0  0
 10 12  2  0  0  0  0
M  END`
      };
      
      return molecules[stepIndex] || null;
    };

    const showFallback = (container) => {
      container.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded" style="height: 400px;">
          <div class="text-center p-6">
            <div class="text-6xl mb-4">🧪</div>
            <p class="text-blue-700 font-semibold text-lg mb-2">${steps[step].title}</p>
            <p class="text-blue-600 text-sm mb-3">SMILES: ${steps[step].smiles}</p>
            <div class="bg-white bg-opacity-60 rounded px-3 py-2 text-xs text-blue-800">
              3D structure could not be loaded<br/>
              Showing molecular information instead
            </div>
          </div>
        </div>
      `;
    };

    return () => clearTimeout(timeout);
  }, [step, steps]);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Navigation Header */}
      <div className="col-span-full mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-900">Reaction Visualizer</h1>
          <div className="flex gap-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Static Mode
            </span>
            <Link 
              to="/visualizer/animated" 
              className="bg-green-200 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-300 transition-colors"
            >
              Animation Mode
            </Link>
            <Link 
              to="/visualizer/synthesis" 
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Synthesis Mode
            </Link>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Interactive visualization of chemical reaction mechanisms</p>
      </div>

      {/* Molecule & Controls */}
      <div className="col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">{steps[step].title}</h2>

        <div
          ref={viewerRef}
          className="w-full border rounded shadow bg-white"
          style={{ 
            height: "400px", 
            minHeight: "400px", 
            position: "relative",
            overflow: "hidden",
            zIndex: 1
          }}
        >
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p>Loading 3D structure...</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`px-4 py-2 rounded ${
              step === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            ◀ Prev
          </button>
          <button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={step === steps.length - 1}
            className={`px-4 py-2 rounded ${
              step === steps.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next ▶
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
          {steps[step].description}
        </p>

        {/* Debug info */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Current Step: {step}</p>
          <p>SMILES: {steps[step].smiles}</p>
          <p>Window.$3Dmol available: {window.$3Dmol ? '✅' : '❌'}</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-gray-50 border p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Reaction Details</h3>
        <p><strong>Paper:</strong> Synthesis of Triazolo-Quinazolines (2005)</p>
        <p><strong>Author:</strong> Dr. Jasbir Singh</p>
        <p><strong>Step:</strong> {step + 1} / {steps.length}</p>

        {steps[step].reagent && (
          <p className="mt-2"><strong>Reagent:</strong> {steps[step].reagent}</p>
        )}

        <p className="mt-2 text-sm text-gray-600">
          This step is part of a multi-stage cyclization producing biologically active heterocycles.
        </p>
      </div>
    </div>
  );
};

export default ReactionVisualizer;