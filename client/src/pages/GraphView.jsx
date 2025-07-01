import { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const GraphView = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const compounds = await axios.get("http://localhost:5001/api/compounds");
        const papers = await axios.get("http://localhost:5001/api/papers");

        const nodes = [];
        const links = [];

        compounds.data.forEach((comp) => {
          nodes.push({ id: comp._id, label: comp.name, type: "compound" });
          comp.relatedPapers.forEach((paperId) => {
            links.push({ source: comp._id, target: paperId });
          });
        });

        papers.data.forEach((paper) => {
          nodes.push({ id: paper._id, label: paper.title, type: "paper" });
        });

        drawGraph(nodes, links);
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
      }
    };

    const drawGraph = (nodes, links) => {
      const width = 900;
      const height = 600;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear old graph

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 2);

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", d => d.type === "compound" ? "#34d399" : "#60a5fa")
        .call(drag(simulation));

      const text = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(d => d.label.length > 20 ? d.label.slice(0, 20) + "..." : d.label)
        .attr("font-size", 10)
        .attr("dx", 12)
        .attr("dy", ".35em");

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        text
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });
    };

    const drag = simulation => {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Compound–Paper Research Graph</h1>
      <svg ref={svgRef} width="900" height="600" className="border rounded bg-white shadow" />
    </div>
  );
};

export default GraphView;