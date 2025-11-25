import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Rotating3DCameraProps {
  cameraType?: 'canon' | 'sony' | 'nikon' | 'fuji' | 'panasonic';
  rotation: number;
  isZoomed: boolean;
  isPlaying: boolean;
}

function CameraModel({ 
  type, 
  rotation, 
  isZoomed 
}: { 
  type: string; 
  rotation: number; 
  isZoomed: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (rotation * Math.PI) / 180;
    }
  });

  return (
    <group ref={groupRef} scale={isZoomed ? 1.5 : 1}>
      {/* Camera Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 0.8]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>

      {/* Lens Mount */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
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
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Grip */}
      <mesh position={[0.8, -0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.7]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Mode Dial */}
      <mesh position={[-0.5, 0.6, 0.2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Brand Accent */}
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
        <mesh key={i} position={[x, 0.4, 0.41]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}

      {/* Hot Shoe */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Shutter Button */}
      <mesh position={[0.7, 0.6, 0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default function Rotating3DCamera({ 
  cameraType = 'canon', 
  rotation, 
  isZoomed,
  isPlaying 
}: Rotating3DCameraProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} />
        <pointLight position={[0, 2, 3]} intensity={0.4} color="#ffffff" />
        <spotLight 
          position={[0, 5, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={0.5}
          castShadow
        />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Camera Model */}
        <CameraModel type={cameraType} rotation={rotation} isZoomed={isZoomed} />
        
        {/* Ground Plane */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* Orbit Controls (disabled auto-rotation since we control it manually) */}
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}
