import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoutePoint {
  x: number;
  y: number;
  z: number;
  label: string;
}

interface SceneProps {
  route: RoutePoint[] | null;
}

function Ground(props: JSX.IntrinsicElements['mesh']) {
  return (
    <mesh {...props} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#4a7b52" />
    </mesh>
  );
}

function RoutePath({ points }: { points: RoutePoint[] }) {
  const positions = useMemo(
    () => points.map((p) => new THREE.Vector3(p.x, p.z + 0.05, p.y)),
    [points]
  );

  return (
    <>
      {/* Main path line */}
      <line>
        <bufferGeometry setFromPoints={positions} />
        <lineBasicMaterial color="#00ff88" linewidth={6} fog={false} />
      </line>

      {/* Start point - green sphere */}
      {positions.length > 0 && (
        <mesh position={positions[0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
        </mesh>
      )}

      {/* End point - cyan sphere */}
      {positions.length > 0 && (
        <mesh position={positions[positions.length - 1]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
        </mesh>
      )}

      {/* Intermediate waypoints - small yellow markers */}
      {positions.slice(1, -1).map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffdc57" emissive="#ffdc57" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
}

function Building({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[4, 4, 4]} />
      <meshStandardMaterial color="#3a4a6a" />
    </mesh>
  );
}

export default function Scene({ route }: SceneProps) {
  useFrame(() => {
    // future animation or condition-driven effects can be added here.
  });

  return (
    <>
      <Ground rotation={[-Math.PI / 2, 0, 0]} />
      <Building position={[-8, 2, -6]} />
      <Building position={[6, 2, 4]} />
      <Building position={[-4, 2, 7]} />

      {/* Render active route or default path */}
      {route ? (
        <RoutePath points={route} />
      ) : (
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      )}
    </>
  );
}
