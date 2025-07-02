import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ReactionAnimation = () => {
  const viewerRef = useRef();
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
            container.innerHTML = `
              <div class="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded" style="min-height: 400px;">
                <div class="text-center p-6">
                  <div class="text-red-500 text-2xl mb-2">⚠️</div>
                  <p class="text-red-600 font-medium">Failed to initialize 3D viewer</p>
                  <p class="text-red-500 text-sm mt-2">Please refresh the page or try a different browser</p>
                </div>
              </div>
            `;
            return;
          }

          const delay = (ms) => new Promise((res) => setTimeout(res, ms));

          const showFallback = (container) => {
            container.innerHTML = `
              <div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded" style="min-height: 400px;">
                <div class="text-center p-6">
                  <div class="text-6xl mb-4">🧪</div>
                  <p class="text-blue-700 font-semibold text-lg mb-2">Reaction Animation</p>
                  <p class="text-blue-600 text-sm mb-3">2-Aminobenzamide → Triazolo-Quinazoline</p>
                  <div class="bg-white bg-opacity-60 rounded px-3 py-2 text-xs text-blue-800">
                    3D animation could not be loaded<br/>
                    Showing fallback content
                  </div>
                </div>
              </div>
            `;
          };

          const runAnimation = async () => {
            try {
              setIsPlaying(true);
              console.log("Starting animation...");

              // Step 1: Load reactant
              setAnimationStep(1);
              const reactantSDF = `2-aminobenzamide
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
M  END`;

              viewer.addModel(reactantSDF, "sdf");
              viewer.setStyle({}, { 
                stick: { radius: 0.2, colorscheme: 'default' }, 
                sphere: { scale: 0.3, colorscheme: 'default' } 
              });
              viewer.zoomTo();
              viewer.render();
              console.log("Reactant loaded");

              await delay(3000);

              // Step 2: Add reagent label
              setAnimationStep(2);
              viewer.addLabel("+ Formic Acid", { 
                position: { x: 3, y: 1, z: 0 }, 
                backgroundColor: "yellow",
                fontColor: "black",
                fontSize: 14
              });
              viewer.render();
              console.log("Reagent label added");

              await delay(2000);

              // Step 3: Transition to product
              setAnimationStep(3);
              viewer.removeAllLabels();
              viewer.removeAllModels();

              const productSDF = `triazolo-quinazoline
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
M  END`;

              viewer.addModel(productSDF, "sdf");
              viewer.setStyle({}, { 
                stick: { radius: 0.2, colorscheme: 'default' }, 
                sphere: { scale: 0.3, colorscheme: 'default' } 
              });
              viewer.zoomTo();
              viewer.render();
              console.log("Product loaded - animation complete");

              // Add completion label
              await delay(1000);
              viewer.addLabel("Triazolo-Quinazoline Product", { 
                position: { x: 0, y: -3, z: 0 }, 
                backgroundColor: "lightgreen",
                fontColor: "darkgreen",
                fontSize: 12
              });
              viewer.render();
              setIsPlaying(false);

            } catch (error) {
              console.error("Animation error:", error);
              setIsPlaying(false);
              showFallback(container);
            }
          };

          // Start animation automatically
          runAnimation();

        } catch (error) {
          console.error("Viewer creation error:", error);
          container.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded" style="min-height: 400px;">
              <div class="text-center p-6">
                <div class="text-red-500 text-2xl mb-2">⚠️</div>
                <p class="text-red-600 font-medium">Failed to initialize 3D viewer</p>
                <p class="text-red-500 text-sm mt-2">Please refresh the page or try a different browser</p>
              </div>
            </div>
          `;
        }
      } else {
        console.warn("3Dmol or container not ready");
        if (viewerRef.current) {
          viewerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded" style="min-height: 400px;">
              <div class="text-center p-6">
                <div class="text-yellow-600 text-2xl mb-2">⏳</div>
                <p class="text-yellow-800 font-medium">Loading 3D viewer...</p>
                <p class="text-yellow-700 text-sm mt-2">Please wait while the animation loads</p>
              </div>
            </div>
          `;
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const resetAnimation = () => {
    setAnimationStep(0);
    setIsPlaying(false);
    // Trigger re-render by updating the effect dependency
    if (viewerRef.current) {
      viewerRef.current.innerHTML = "";
    }
    // Re-trigger the useEffect
    setTimeout(() => {
      if (window.location.pathname === '/visualizer/animated') {
        window.location.reload();
      }
    }, 100);
  };

  const getStepDescription = () => {
    switch(animationStep) {
      case 0: return "Ready to start animation";
      case 1: return "Loading reactant: 2-Aminobenzamide";
      case 2: return "Adding formic acid reagent";
      case 3: return "Formation of triazolo-quinazoline product";
      default: return "Animation step";
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-900">3D Reaction Animation</h1>
          <div className="flex gap-2">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Animation Mode
            </span>
            <Link 
              to="/visualizer" 
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Switch to Static Mode
            </Link>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Automated animation of triazolo-quinazoline formation</p>
      </div>

      {/* Animation Status */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-800 font-medium">
              {getStepDescription()}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              {isPlaying ? "Animation in progress..." : "Animation ready"}
            </p>
          </div>
          <button
            onClick={resetAnimation}
            disabled={isPlaying}
            className={`px-4 py-2 rounded text-sm font-medium ${
              isPlaying 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isPlaying ? 'Playing...' : 'Restart Animation'}
          </button>
        </div>
      </div>

      {/* 3D Viewer Container */}
      <div className="bg-white border shadow rounded p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Triazolo-Quinazoline Formation
        </h2>
        <div
          ref={viewerRef}
          className="w-full border shadow rounded bg-white"
          style={{ 
            height: "500px", 
            minHeight: "500px",
            position: "relative",
            overflow: "hidden"
          }}
        />
      </div>

      {/* Reaction Information */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-800 mb-2">Reaction Overview</h3>
          <p className="text-gray-700 text-sm">
            This animation demonstrates the cyclization of 2-aminobenzamide with formic acid 
            to form a triazolo-quinazoline heterocycle, a key pharmacophore in medicinal chemistry.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-800 mb-2">Animation Steps</h3>
          <ol className="text-gray-700 text-sm space-y-1">
            <li>1. Display starting material (2-aminobenzamide)</li>
            <li>2. Add formic acid reagent</li>
            <li>3. Show product formation (triazolo-quinazoline)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReactionAnimation;