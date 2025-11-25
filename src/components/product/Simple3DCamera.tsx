import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Camera3DProps {
  cameraType?: 'canon' | 'sony' | 'nikon' | 'fuji' | 'panasonic';
}

function CameraBody({ type }: { type: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Camera Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Lens Mount */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.6, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* Lens Glass */}
      <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshPhysicalMaterial 
          color="#1a2a3a" 
          transparent={true} 
          opacity={0.3} 
          roughness={0.0} 
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Viewfinder Bump */}
      <mesh position={[0, 0.6, -0.2]}>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Grip */}
      <mesh position={[0.8, -0.1, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.7]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Mode Dial */}
      <mesh position={[-0.5, 0.6, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Brand accent (color varies by type) */}
      <mesh position={[0.6, 0.3, 0.41]}>
        <boxGeometry args={[0.2, 0.1, 0.01]} />
        <meshStandardMaterial 
          color={
            type === 'canon' ? '#cc0000' : 
            type === 'sony' ? '#ff6600' : 
            type === 'nikon' ? '#ffcc00' : 
            type === 'fuji' ? '#00ccff' : 
            '#ff3366'
          } 
          emissive={
            type === 'canon' ? '#cc0000' : 
            type === 'sony' ? '#ff6600' : 
            type === 'nikon' ? '#ffcc00' : 
            type === 'fuji' ? '#00ccff' : 
            '#ff3366'
          }
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* LCD Screen */}
      <mesh position={[0, 0, -0.41]}>
        <boxGeometry args={[0.8, 0.6, 0.01]} />
        <meshStandardMaterial 
          color="#1a3a5a" 
          emissive="#1a3a5a" 
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Buttons */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0.41]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function Simple3DCamera({ cameraType = 'canon' }: Camera3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={8}
          autoRotate={false}
        />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <pointLight position={[0, 2, 3]} intensity={0.3} color="#ffffff" />
        
        {/* Camera model */}
        <CameraBody type={cameraType} />
        
        {/* Ground plane for shadows */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  );
}
