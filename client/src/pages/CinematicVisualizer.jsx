import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useState } from 'react';

const Atom = ({ position, color = 'skyblue', label }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {label && (
      <Html distanceFactor={10} center position={[0, 0.4, 0]}>
        <div className="text-xs bg-white bg-opacity-80 px-1 py-0.5 rounded shadow">{label}</div>
      </Html>
    )}
  </group>
);

const Arrow = ({ from, to }) => {
  const direction = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  ];
  return (
    <arrowHelper
      args={[direction, from, 1, 'red']}
    />
  );
};

const CinematicReaction = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      label: 'Reactant: 2-Aminobenzamide',
      atoms: [
        { pos: [-2, 0, 0], label: 'C' },
        { pos: [-1, 1, 0], label: 'C' },
        { pos: [0, 1.5, 0], label: 'N', color: 'orange' },
        { pos: [1, 0.8, 0], label: 'O', color: 'red' },
        { pos: [0, 0, 0], label: 'C' },
      ],
      arrow: null,
    },
    {
      label: 'Reagent enters: Formic Acid',
      atoms: [
        { pos: [-2, 0, 0], label: 'C' },
        { pos: [-1, 1, 0], label: 'C' },
        { pos: [0, 1.5, 0], label: 'N', color: 'orange' },
        { pos: [1, 0.8, 0], label: 'O', color: 'red' },
        { pos: [0, 0, 0], label: 'C' },
        { pos: [2, 0, 0], label: 'HCOOH', color: 'yellow' },
      ],
      arrow: { from: [2, 0, 0], to: [0, 0, 0] },
    },
    {
      label: 'Product formed: Triazolo-quinazoline',
      atoms: [
        { pos: [-2, 0, 0], label: 'N', color: 'orange' },
        { pos: [-1, 1, 0], label: 'C' },
        { pos: [0, 1.5, 0], label: 'C' },
        { pos: [1, 0.8, 0], label: 'N', color: 'orange' },
        { pos: [0, 0, 0], label: 'C' },
        { pos: [1.5, -0.2, 0], label: 'N', color: 'orange' },
        { pos: [2.5, 0, 0], label: 'C' },
      ],
      arrow: null,
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Cinematic Reaction Player</h1>
      <p className="mb-2 text-sm text-gray-600">{current.label}</p>

      <div className="h-[500px] w-full rounded border shadow">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />

          {current.atoms.map((atom, i) => (
            <Atom key={i} position={atom.pos} color={atom.color} label={atom.label} />
          ))}

          {current.arrow && <Arrow from={current.arrow.from} to={current.arrow.to} />}
        </Canvas>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          ◀ Prev
        </button>
        <button
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default CinematicReaction;