
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

/* =========================================
   MAIN 3D SHIELD AND LOCK
========================================= */

function Shield() {
  const shieldRef = useRef();
  const lockRef = useRef();

  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0, 1.65);
    shape.lineTo(1.05, 1.2);
    shape.lineTo(0.95, 0.1);
    shape.quadraticCurveTo(0.8, -0.95, 0, -1.55);
    shape.quadraticCurveTo(-0.8, -0.95, -0.95, 0.1);
    shape.lineTo(-1.05, 1.2);
    shape.closePath();

    return shape;
  }, []);

  const shieldGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.07,
    });
  }, [shieldShape]);

  const innerGeometry = useMemo(() => {
    return new THREE.ShapeGeometry(shieldShape);
  }, [shieldShape]);

  const shackleGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.27, 0.02, 0),
      new THREE.Vector3(-0.27, 0.43, 0),
      new THREE.Vector3(-0.2, 0.65, 0),
      new THREE.Vector3(0, 0.72, 0),
      new THREE.Vector3(0.2, 0.65, 0),
      new THREE.Vector3(0.27, 0.43, 0),
      new THREE.Vector3(0.27, 0.02, 0),
    ];

    const curve = new THREE.CatmullRomCurve3(points);

    return new THREE.TubeGeometry(curve, 32, 0.065, 12, false);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(t * 0.4) * 0.1;
      shieldRef.current.rotation.x = Math.sin(t * 0.3) * 0.025;
    }

    if (lockRef.current) {
      lockRef.current.position.y =
        -0.05 + Math.sin(t * 1.4) * 0.025;
    }
  });

  return (
    <group ref={shieldRef} position={[0, 0.05, 0]} scale={0.88}>

      {/* Outer metallic shield */}
      <mesh geometry={shieldGeometry} castShadow>
        <meshPhysicalMaterial
          color="#721329"
          metalness={0.9}
          roughness={0.3}
          emissive="#35000e"
          emissiveIntensity={0.25}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Inner shield surface */}
      <mesh
        geometry={innerGeometry}
        position={[0, 0, 0.31]}
      >
        <meshPhysicalMaterial
          color="#171018"
          metalness={0.85}
          roughness={0.32}
          emissive="#30000c"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shield outline */}
      <mesh
        geometry={shieldGeometry}
        position={[0, 0, 0.015]}
        scale={1.015}
      >
        <meshBasicMaterial
          color="#ff1744"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      {/* Lock */}
      <group ref={lockRef} position={[0, -0.05, 0.55]}>

        {/* Lock shackle */}
        <mesh
          geometry={shackleGeometry}
          position={[0, 0.22, 0]}
        >
          <meshPhysicalMaterial
            color="#ff526e"
            metalness={0.9}
            roughness={0.22}
            emissive="#7d001b"
            emissiveIntensity={0.45}
          />
        </mesh>

        {/* Lock body */}
        <RoundedBox
          args={[0.68, 0.68, 0.24]}
          radius={0.12}
          smoothness={5}
          position={[0, -0.2, 0.08]}
          castShadow
        >
          <meshPhysicalMaterial
            color="#a30d2d"
            metalness={0.8}
            roughness={0.28}
            emissive="#550014"
            emissiveIntensity={0.4}
            clearcoat={1}
          />
        </RoundedBox>

        {/* Keyhole */}
        <mesh position={[0, -0.18, 0.23]}>
          <circleGeometry args={[0.075, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0, -0.31, 0.23]}>
          <cylinderGeometry args={[0.027, 0.027, 0.13, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

      </group>
    </group>
  );
}

/* =========================================
   ROTATING ENERGY RINGS
========================================= */

function EnergyRings() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.09;
    }
  });

  return (
    <group ref={group}>
      {[1.95, 2.25, 2.55].map((radius, index) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, 0.012, 12, 160]} />
          <meshBasicMaterial
            color={index === 1 ? "#ff1744" : "#8b102c"}
            transparent
            opacity={index === 1 ? 0.75 : 0.35}
          />
        </mesh>
      ))}

      <mesh rotation={[0, 0, 0.4]}>
        <torusGeometry
          args={[2.7, 0.018, 12, 160, Math.PI * 1.1]}
        />
        <meshBasicMaterial color="#ff1744" />
      </mesh>
    </group>
  );
}

/* =========================================
   FLOATING SECURITY FEATURE PANELS
========================================= */

function SecurityPanel({ position, icon, title, subtitle }) {
  const panelRef = useRef();

  useFrame((state) => {
    if (panelRef.current) {
      panelRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * 1.1 + position[0]) * 0.035;
    }
  });

  return (
    <group ref={panelRef} position={position}>

      {/* Physical 3D panel */}
      <RoundedBox
        args={[1.8, 0.95, 0.14]}
        radius={0.09}
        smoothness={5}
      >
        <meshPhysicalMaterial
          color="#171219"
          metalness={0.65}
          roughness={0.3}
          emissive="#35000e"
          emissiveIntensity={0.2}
          clearcoat={1}
        />
      </RoundedBox>

      {/* Icon */}
      <Text
        position={[0, 0.24, 0.09]}
        fontSize={0.25}
        color="#ff3159"
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>

      {/* Feature title */}
      <Text
        position={[0, -0.055, 0.09]}
        fontSize={0.135}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.65}
        textAlign="center"
      >
        {title}
      </Text>

      {/* Feature subtitle */}
      <Text
        position={[0, -0.29, 0.09]}
        fontSize={0.085}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.65}
        textAlign="center"
      >
        {subtitle}
      </Text>

    </group>
  );
}

/* =========================================
   FLOATING PARTICLES
========================================= */

function Particles() {
  const points = useMemo(() => {
    return Array.from({ length: 65 }, () => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 1.5,
      ],
      size: Math.random() * 0.02 + 0.008,
    }));
  }, []);

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point.position}>
          <sphereGeometry args={[point.size, 8, 8]} />
          <meshBasicMaterial
            color="#ff1744"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================
   MAIN 3D CYBERSECURITY ENVIRONMENT
========================================= */

function CyberWorld() {
  return (
    <>
      <ambientLight intensity={0.8} />

      <pointLight
        position={[0, 1, 4]}
        color="#ff1744"
        intensity={18}
        distance={10}
      />

      <pointLight
        position={[-4, 2, 2]}
        color="#dc143c"
        intensity={12}
        distance={8}
      />

      <pointLight
        position={[4, -2, 2]}
        color="#ff526e"
        intensity={10}
        distance={8}
      />

      {/* Entire 3D composition */}
      <group position={[0, -0.08, 0]} scale={1.08}>

        {/* Main shield */}
        <Float
          speed={1.3}
          rotationIntensity={0.06}
          floatIntensity={0.15}
        >
          <Shield />
        </Float>

        {/* Background effects */}
        <EnergyRings />
        <Particles />

        {/* Four feature panels */}
        <SecurityPanel
          position={[-2.15, 1.3, 0.2]}
          icon="⌘"
          title="Code Scanner"
          subtitle="Vulnerability detection"
        />

        <SecurityPanel
          position={[2.15, 1.3, 0.2]}
          icon="◎"
          title="URL Scanner"
          subtitle="Phishing detection"
        />

        <SecurityPanel
          position={[-2.15, -1.3, 0.2]}
          icon="▤"
          title="Message Checker"
          subtitle="Scam detection"
        />

        <SecurityPanel
          position={[2.15, -1.3, 0.2]}
          icon="♧"
          title="Cyber Alert"
          subtitle="Threat reports"
        />

      </group>
    </>
  );
}

/* =========================================
   EXPORTED CYBER SCENE
========================================= */

export default function CyberScene() {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[#DC143C]/5 blur-[100px] rounded-full pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 10.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <CyberWorld />
      </Canvas>

    </div>
  );
}
