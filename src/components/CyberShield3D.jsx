
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function ShieldModel() {
  const shield = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (shield.current) {
      shield.current.rotation.y = Math.sin(t * 0.45) * 0.35;
      shield.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }

    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.25;
      ring1.current.rotation.y += delta * 0.4;
    }

    if (ring2.current) {
      ring2.current.rotation.x -= delta * 0.3;
      ring2.current.rotation.z += delta * 0.2;
    }

    if (core.current) {
      core.current.scale.setScalar(
        1 + Math.sin(t * 2) * 0.04
      );
    }
  });

  return (
    <group>
      {/* Floating shield */}
      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.3}>
        <group ref={shield} position={[0, 0, 0.2]}>
          {/* Shield shape */}
          <mesh>
            <shapeGeometry args={[
              (() => {
                const shape = new THREE.Shape();
                shape.moveTo(0, 1.45);
                shape.lineTo(0.9, 1.05);
                shape.lineTo(0.85, 0.2);
                shape.quadraticCurveTo(0.65, -0.7, 0, -1.15);
                shape.quadraticCurveTo(-0.65, -0.7, -0.85, 0.2);
                shape.lineTo(-0.9, 1.05);
                shape.closePath();
                return shape;
              })()
            ]} />
            <meshBasicMaterial
              color="#dc143c"
              wireframe
              transparent
              opacity={0.75}
            />
          </mesh>

          {/* Inner shield */}
          <mesh position={[0, 0, 0.04]}>
            <shapeGeometry args={[
              (() => {
                const shape = new THREE.Shape();
                shape.moveTo(0, 1.15);
                shape.lineTo(0.65, 0.85);
                shape.lineTo(0.6, 0.15);
                shape.quadraticCurveTo(0.45, -0.55, 0, -0.85);
                shape.quadraticCurveTo(-0.45, -0.55, -0.6, 0.15);
                shape.lineTo(-0.65, 0.85);
                shape.closePath();
                return shape;
              })()
            ]} />
            <meshBasicMaterial
              color="#ff526e"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Shield outline glow */}
          <mesh position={[0, 0, 0.07]}>
            <shapeGeometry args={[
              (() => {
                const shape = new THREE.Shape();
                shape.moveTo(0, 1.35);
                shape.lineTo(0.8, 1);
                shape.lineTo(0.75, 0.2);
                shape.quadraticCurveTo(0.6, -0.6, 0, -1.05);
                shape.quadraticCurveTo(-0.6, -0.6, -0.75, 0.2);
                shape.lineTo(-0.8, 1);
                shape.closePath();
                return shape;
              })()
            ]} />
            <meshBasicMaterial
              color="#ff1744"
              wireframe
              transparent
              opacity={0.25}
            />
          </mesh>

          {/* Checkmark */}
          <group position={[0, 0.05, 0.13]}>
            <mesh rotation={[0, 0, -0.65]} position={[-0.16, -0.02, 0]}>
              <boxGeometry args={[0.12, 0.45, 0.08]} />
              <meshBasicMaterial color="#ff526e" />
            </mesh>
            <mesh rotation={[0, 0, 0.65]} position={[0.13, 0.08, 0]}>
              <boxGeometry args={[0.12, 0.72, 0.08]} />
              <meshBasicMaterial color="#ff526e" />
            </mesh>
          </group>
        </group>
      </Float>

      {/* Holographic orbital rings */}
      <mesh ref={ring1} rotation={[1.1, 0.3, 0.2]}>
        <torusGeometry args={[1.55, 0.012, 8, 120]} />
        <meshBasicMaterial
          color="#dc143c"
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh ref={ring2} rotation={[0.4, 1.2, 0.6]}>
        <torusGeometry args={[1.8, 0.008, 8, 120]} />
        <meshBasicMaterial
          color="#ff526e"
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Energy core */}
      <mesh ref={core} position={[0, 0, -0.4]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial
          color="#ff1744"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Floating particles */}
      <Sparkles
        count={65}
        scale={[4, 4, 3]}
        size={2}
        speed={0.4}
        color="#ff526e"
        opacity={0.65}
      />

      <pointLight color="#dc143c" intensity={3} distance={5} />
    </group>
  );
}

export default function CyberShield3D() {
  return (
    <div className="cyber-shield-3d">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <ShieldModel />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
