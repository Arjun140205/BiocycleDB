import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as $3Dmol from "3dmol";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiArrowLeft, FiExternalLink, FiTag, FiBox } from "react-icons/fi";

const CompoundDetails = () => {
  const { id } = useParams();
  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const viewerRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/compounds/${id}`)
      .then(res => {
        setCompound(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (compound?.smiles && viewerRef.current) {
      viewerRef.current.innerHTML = "";
      const element = viewerRef.current;
      const config = { backgroundColor: "#f8fafc" };
      const viewer = $3Dmol.createViewer(element, config);
      $3Dmol.download("smiles:" + compound.smiles, viewer, {}, () => {
        viewer.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
        viewer.zoomTo();
        viewer.render();
      });
    }
  }, [compound]);

  if (loading) {
    return <LoadingSpinner message="Loading compound details..." />;
  }

  if (!compound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiBox className="w-10 h-10 text-secondary-400" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Compound not found</h2>
          <p className="text-secondary-600 mb-6">The requested compound could not be found.</p>
          <Link
            to="/compounds"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 shadow-soft transition-all"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Browse Compounds</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link 
            to="/compounds" 
            className="inline-flex items-center space-x-2 text-sm text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Compounds</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-2">{compound.name}</h1>
          {compound.iupacName && (
            <p className="text-lg text-secondary-600 italic">{compound.iupacName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3D Viewer */}
            <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
                <FiBox className="w-5 h-5 mr-2 text-primary-600" />
                Molecular Structure
              </h2>
              <div 
                ref={viewerRef} 
                className="w-full h-96 border border-secondary-200 rounded-xl bg-secondary-50"
              />
            </div>

            {/* Description */}
            {compound.description && (
              <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Description</h2>
                <p className="text-secondary-700 leading-relaxed">{compound.description}</p>
              </div>
            )}

            {/* Related Papers */}
            {compound.relatedPapers?.length > 0 && (
              <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Related Research Papers</h2>
                <div className="space-y-4">
                  {compound.relatedPapers.map(paper => (
                    <div key={paper._id} className="border-l-4 border-primary-500 pl-4 py-2">
                      <h3 className="font-semibold text-secondary-900 mb-1">{paper.title}</h3>
                      <p className="text-sm text-secondary-600 mb-2">{paper.authors?.join(", ")}</p>
                      <p className="text-sm text-secondary-700 mb-2">{paper.abstract}</p>
                      {paper.link && (
                        <a 
                          href={paper.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <span>View full paper</span>
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Properties */}
            <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Properties</h2>
              <dl className="space-y-4">
                {compound.category && (
                  <div>
                    <dt className="text-sm font-medium text-secondary-600 mb-1">Category</dt>
                    <dd className="text-sm text-secondary-900 font-medium">{compound.category}</dd>
                  </div>
                )}
                {compound.smiles && (
                  <div>
                    <dt className="text-sm font-medium text-secondary-600 mb-1">SMILES</dt>
                    <dd className="text-xs text-secondary-900 font-mono bg-secondary-50 p-2 rounded break-all">
                      {compound.smiles}
                    </dd>
                  </div>
                )}
                {compound.bioactivity && compound.bioactivity.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-secondary-600 mb-1">Bioactivity</dt>
                    <dd className="text-sm text-secondary-900">{compound.bioactivity.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Tags */}
            {compound.tags && compound.tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <FiTag className="w-4 h-4 mr-2 text-primary-600" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {compound.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-secondary-100 text-secondary-700 text-sm rounded-lg font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synthesis Route */}
            {compound.synthesisRoute && (
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 shadow-soft text-white">
                <h2 className="text-lg font-semibold mb-2">Synthesis Available</h2>
                <p className="text-primary-100 text-sm mb-4">View the complete synthesis pathway for this compound</p>
                <Link 
                  to={`/synthesis/${compound.synthesisRoute}`} 
                  className="block w-full bg-white text-primary-600 text-center py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                >
                  View Synthesis Pathway
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundDetails;
