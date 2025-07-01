import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as $3Dmol from "3dmol";

const CompoundDetails = () => {
  const { id } = useParams();
  const [compound, setCompound] = useState(null);
  const viewerRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/compounds/${id}`)
      .then(res => setCompound(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (compound?.smiles && viewerRef.current) {
      viewerRef.current.innerHTML = ""; // Clear old viewer
      const element = viewerRef.current;
      const config = { backgroundColor: "white" };
      const viewer = $3Dmol.createViewer(element, config);
      $3Dmol.download("smiles:" + compound.smiles, viewer, {}, () => {
        viewer.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
        viewer.zoomTo();
        viewer.render();
      });
    }
  }, [compound]);

  if (!compound) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{compound.name}</h1>
      <p className="text-gray-600 italic">{compound.iupacName}</p>
      <p className="text-md">{compound.description}</p>
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm bg-blue-100 px-2 py-1 rounded">Category: {compound.category}</span>
        {compound.tags.map((tag, i) => (
          <span key={i} className="text-xs bg-green-200 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mt-4 mb-2">Molecular Structure</h3>
        <div ref={viewerRef} style={{ width: "100%", height: "400px" }} className="border rounded shadow" />
      </div>

      {compound.relatedPapers?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mt-4 mb-2">Linked Research Papers</h3>
          {compound.relatedPapers.map(paper => (
            <div key={paper._id} className="border p-3 rounded mb-3 bg-gray-50">
              <h4 className="font-semibold">{paper.title}</h4>
              <p className="text-sm italic">{paper.authors.join(", ")}</p>
              <p className="text-sm mt-2">{paper.abstract}</p>
              {paper.link && (
                <a href={paper.link} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm mt-1 inline-block">View full paper</a>
              )}
            </div>
          ))}
        </div>
      )}

      {compound.synthesisRoute && (
        <Link to={`/synthesis/${compound.synthesisRoute}`} className="inline-block px-4 py-2 bg-purple-600 text-white rounded">
          View Synthesis Pathway →
        </Link>
      )}
    </div>
  );
};

export default CompoundDetails;