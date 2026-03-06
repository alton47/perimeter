"use client";
import { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store";
import { ZONES } from "@/data/zones";
import { RISK_COLORS } from "@/lib/constants";
import type { Zone } from "@/types";

// ─── helpers ────────────────────────────────────────────────────────────────
function ll2v(lat: number, lng: number, r = 1.0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function outQ(lat: number, lng: number): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    ll2v(lat, lng).normalize(),
  );
}

// ─── Continent outlines (simplified polygons, gray) ─────────────────────────
// Key Middle East + surrounding regions as lat/lng polylines
const CONTINENT_OUTLINES: Array<Array<[number, number]>> = [
  // Arabian Peninsula
  [
    [30, 32],
    [29, 34],
    [28, 34],
    [26, 37],
    [23, 37],
    [15, 43],
    [12, 45],
    [12, 44],
    [14, 42],
    [15, 43],
    [17, 41],
    [18, 41],
    [20, 39],
    [21, 38],
    [22, 37],
    [24, 37],
    [27, 35],
    [29, 34],
    [30, 32],
  ],
  // Levant coast
  [
    [37, 37],
    [36, 36],
    [35, 35],
    [33, 35],
    [32, 34],
    [31, 34],
    [30, 34],
    [29, 35],
    [28, 34],
    [26, 34],
    [24, 37],
  ],
  // Iraq / Iran rough
  [
    [37, 42],
    [37, 38],
    [36, 38],
    [36, 41],
    [34, 44],
    [33, 46],
    [31, 47],
    [30, 48],
    [29, 50],
    [27, 50],
    [25, 55],
    [24, 57],
    [24, 59],
    [27, 61],
    [30, 61],
    [33, 60],
    [36, 59],
    [38, 58],
    [38, 55],
    [37, 50],
    [37, 46],
    [37, 42],
  ],
  // Turkey
  [
    [42, 36],
    [42, 32],
    [41, 30],
    [40, 28],
    [38, 26],
    [37, 28],
    [36, 28],
    [36, 29],
    [37, 30],
    [36, 32],
    [36, 36],
    [37, 37],
    [38, 40],
    [39, 42],
    [40, 44],
    [41, 44],
    [42, 42],
    [42, 40],
    [42, 38],
    [42, 36],
  ],
  // Egypt / North Africa strip
  [
    [31, 24],
    [31, 25],
    [30, 28],
    [30, 32],
    [29, 34],
    [28, 33],
    [27, 33],
    [24, 37],
    [22, 37],
    [22, 25],
    [24, 25],
    [24, 24],
    [31, 24],
  ],
  // Horn of Africa / Yemen coast
  [
    [12, 44],
    [12, 43],
    [12, 42],
    [11, 41],
    [11, 43],
    [10, 44],
    [11, 45],
    [11, 47],
    [12, 47],
    [12, 44],
  ],
];

function ContinentLines() {
  const geoms = useMemo(
    () =>
      CONTINENT_OUTLINES.map((poly) => {
        const pts = poly.map(([lat, lng]) => ll2v(lat, lng, 1.001));
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [],
  );

  return (
    <group>
      {geoms.map((g, i) => (
        <line key={i}>
          <primitive object={g} attach="geometry" />
          <lineBasicMaterial
            color="#4a6080"
            transparent
            opacity={0.55}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}

// ─── Lat/Lng grid ────────────────────────────────────────────────────────────
function GlobeGrid() {
  const geoms = useMemo(() => {
    const result: THREE.BufferGeometry[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 4)
        pts.push(ll2v(lat, lng, 1.002));
      result.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) pts.push(ll2v(lat, lng, 1.002));
      result.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return result;
  }, []);
  return (
    <group>
      {geoms.map((g, i) => (
        <line key={i}>
          <primitive object={g} attach="geometry" />
          <lineBasicMaterial color="#1e3a5a" transparent opacity={0.4} />
        </line>
      ))}
    </group>
  );
}

// ─── Earth — much brighter ocean, visible landmass tint ──────────────────────
function Earth({ paused }: { paused: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current && !paused) ref.current.rotation.y += d * 0.04;
  });
  return (
    <mesh ref={ref} receiveShadow>
      <sphereGeometry args={[1, 80, 80]} />
      {/* Noticeably brighter ocean-blue globe */}
      <meshPhongMaterial
        color="#0d2a44" // visible ocean blue
        emissive="#0a1e30" // strong emissive so it's never black
        emissiveIntensity={0.6}
        specular="#2a6090"
        shininess={20}
      />
    </mesh>
  );
}

// ─── Middle East region highlight (amber tint on surface) ────────────────────
function MiddleEastHighlight() {
  // Draw a visible filled region over Middle East using many small circles
  const meshes = useMemo(() => {
    const pts: Array<{ lat: number; lng: number }> = [];
    for (let lat = 13; lat <= 40; lat += 3) {
      for (let lng = 27; lng <= 63; lng += 3) {
        pts.push({ lat, lng });
      }
    }
    return pts;
  }, []);

  return (
    <group>
      {meshes.map((p, i) => {
        const pos = ll2v(p.lat, p.lng, 1.001);
        const q = outQ(p.lat, p.lng);
        return (
          <mesh key={i} position={pos} quaternion={q}>
            <circleGeometry args={[0.028, 8]} />
            <meshBasicMaterial
              color="#c47a00"
              transparent
              opacity={0.09}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Atmosphere ───────────────────────────────────────────────────────────────
function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[1.025, 32, 32]} />
        <meshBasicMaterial
          color="#1a6fcc"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.065, 32, 32]} />
        <meshBasicMaterial
          color="#0a2244"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const N = 2000;
  const { pos, col } = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 2.2 + Math.random() * 4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      col[i * 3] = 0.3 + Math.random() * 0.4;
      col[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      col[i * 3 + 2] = 0.7 + Math.random() * 0.3;
    }
    return { pos, col };
  }, []);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.015;
      ref.current.rotation.x += d * 0.004;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.007}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Arc between two zones ─────────────────────────────────────────────────
function RiskArc({ from, to }: { from: Zone; to: Zone }) {
  const dotRef = useRef<THREE.Mesh>(null);

  const [initialPct] = useState(() => Math.random());
  const pct = useRef(initialPct);

  const color = RISK_COLORS[from.risk_level];
  const { curve, pts } = useMemo(() => {
    const a = ll2v(from.center.lat, from.center.lng);
    const b = ll2v(to.center.lat, to.center.lng);
    const mid = a.clone().add(b).normalize().multiplyScalar(1.5);
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    return { curve: c, pts: c.getPoints(80) };
  }, [from, to]);
  useFrame((_, d) => {
    pct.current = (pct.current + d * 0.18) % 1;
    if (dotRef.current)
      dotRef.current.position.copy(curve.getPoint(pct.current));
  });
  return (
    <group>
      <line>
        <bufferGeometry setFromPoints={pts} />
        <lineBasicMaterial color={color} transparent opacity={0.2} />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.007, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─── Zone visual: halo + ring + pillar ─────────────────────────────────────
function ZoneVisual({ zone, selected }: { zone: Zone; selected: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pillarRef = useRef<THREE.Mesh>(null);
  const color = RISK_COLORS[zone.risk_level];
  const pos = ll2v(zone.center.lat, zone.center.lng, 1.003);
  const q = outQ(zone.center.lat, zone.center.lng);
  const scale =
    zone.risk_level === "CRITICAL"
      ? 0.095
      : zone.risk_level === "RED"
        ? 0.072
        : 0.052;
  const pillarH =
    zone.risk_level === "CRITICAL"
      ? 0.3
      : zone.risk_level === "RED"
        ? 0.2
        : 0.12;
  const pillarPos = ll2v(zone.center.lat, zone.center.lng, 1 + pillarH / 2);
  const pillarQ = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    ll2v(zone.center.lat, zone.center.lng).normalize(),
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const pulse =
      1 + Math.sin(t * 1.8 + zone.center.lng * 0.1) * (selected ? 0.18 : 0.1);

    if (ringRef.current) {
      ringRef.current.scale.setScalar(pulse);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = selected
        ? 0.9 + Math.sin(t * 2) * 0.1
        : 0.55 + Math.sin(t * 1.6) * 0.2;
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(pulse * 1.1);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 1.4) * 0.05;
    }
    if (pillarRef.current) {
      pillarRef.current.scale.y =
        1 + Math.sin(t * 2 + zone.center.lat * 0.2) * 0.2;
      (pillarRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.55 + Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group>
      {/* Halo fill */}
      <mesh ref={haloRef} position={pos} quaternion={q}>
        <circleGeometry args={[scale * 1.3, 40]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Ring border */}
      <mesh ref={ringRef} position={pos} quaternion={q}>
        <ringGeometry args={[scale * 0.78, scale, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Light pillar */}
      <mesh ref={pillarRef} position={pillarPos} quaternion={pillarQ}>
        <cylinderGeometry args={[0.004, 0.012, pillarH, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      {/* Core dot — always very visible */}
      <mesh position={ll2v(zone.center.lat, zone.center.lng, 1.008)}>
        <sphereGeometry args={[selected ? 0.012 : 0.009, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─── Zone HTML label ────────────────────────────────────────────────────────
function ZoneLabel({ zone, onClick }: { zone: Zone; onClick: () => void }) {
  const color = RISK_COLORS[zone.risk_level];
  const pos = ll2v(zone.center.lat, zone.center.lng, 1.09);
  return (
    <Html
      position={pos.toArray()}
      center
      distanceFactor={3.2}
      zIndexRange={[0, 10]}
    >
      <button
        onClick={onClick}
        style={{
          fontFamily: "Space Mono, monospace",
          fontSize: 9,
          color,
          background: "rgba(8,12,20,0.88)",
          border: `1px solid ${color}55`,
          borderRadius: 4,
          padding: "2px 6px",
          whiteSpace: "nowrap",
          letterSpacing: "0.07em",
          cursor: "pointer",
          outline: "none",
          textShadow: `0 0 8px ${color}`,
          boxShadow: `0 0 12px rgba(0,0,0,0.6)`,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            `${color}22`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(8,12,20,0.88)";
        }}
      >
        {zone.name}
      </button>
    </Html>
  );
}

// ─── User location marker ───────────────────────────────────────────────────
function UserMarker({
  lat,
  lng,
  continent,
}: {
  lat: number;
  lng: number;
  continent: string;
}) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const pos = ll2v(lat, lng, 1.012);
  const q = outQ(lat, lng);
  const color = "#4d9fff";

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.scale.setScalar(1 + Math.sin(t * 2) * 0.28);
      (ring1.current.material as THREE.MeshBasicMaterial).opacity =
        0.35 + Math.sin(t * 2) * 0.2;
    }
    if (ring2.current) {
      ring2.current.scale.setScalar(1 + Math.sin(t * 2 + 1) * 0.28);
      (ring2.current.material as THREE.MeshBasicMaterial).opacity =
        0.2 + Math.sin(t * 2 + 1) * 0.15;
    }
  });

  return (
    <group>
      <mesh ref={ring1} position={pos} quaternion={q}>
        <ringGeometry args={[0.016, 0.021, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ring2} position={pos} quaternion={q}>
        <ringGeometry args={[0.025, 0.03, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Core */}
      <mesh position={pos}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Label */}
      <Html
        position={pos.toArray()}
        center
        distanceFactor={3}
        zIndexRange={[0, 20]}
      >
        <div
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: 9,
            color: "#fff",
            background: "rgba(8,12,20,0.92)",
            border: `1px solid ${color}66`,
            borderRadius: 4,
            padding: "3px 7px",
            whiteSpace: "nowrap",
            marginTop: -28,
            boxShadow: `0 0 16px ${color}44, 0 4px 12px rgba(0,0,0,0.7)`,
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ color }}> YOU</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>
            {" "}
            · {continent}
          </span>
        </div>
      </Html>
    </group>
  );
}

// ─── Full scene ─────────────────────────────────────────────────────────────
function Scene() {
  const { selectedZone, setSelectedZone, globePaused, riskResult } = useStore();

  const arcs = useMemo(() => {
    const hot = ZONES.filter(
      (z) => z.risk_level === "CRITICAL" || z.risk_level === "RED",
    );
    return hot
      .slice(0, hot.length - 1)
      .map((z, i) => ({ from: z, to: hot[(i + 1) % hot.length] }));
  }, []);

  const user = riskResult?.user_coordinates ?? null;
  const continent = riskResult?.continent ?? "your region";

  return (
    <>
      {/* Brighter multi-point lighting so globe is clearly visible */}
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[4, 3, 4]}
        intensity={1.2}
        color="#e8f4ff"
        castShadow
      />
      <directionalLight
        position={[-4, -1, -3]}
        intensity={0.5}
        color="#1a4a7a"
      />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#4488cc" />
      <pointLight position={[2, -3, 2]} intensity={0.4} color="#002244" />

      <Particles />
      <Stars radius={250} depth={60} count={4000} factor={3} fade speed={0.4} />

      <Earth paused={globePaused} />
      <GlobeGrid />
      <ContinentLines />
      <MiddleEastHighlight />
      <Atmosphere />

      {/* Zones */}
      {ZONES.map((z) => (
        <group key={z.id}>
          <ZoneVisual zone={z} selected={selectedZone?.id === z.id} />
          <ZoneLabel
            zone={z}
            onClick={() =>
              setSelectedZone(selectedZone?.id === z.id ? null : z)
            }
          />
        </group>
      ))}

      {/* Arcs between hotspots */}
      {arcs.map((a, i) => (
        <RiskArc key={i} from={a.from} to={a.to} />
      ))}

      {/* User pin */}
      {user && (
        <UserMarker lat={user.lat} lng={user.lng} continent={continent} />
      )}

      <OrbitControls
        enablePan={false}
        minDistance={1.3}
        maxDistance={5}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        autoRotate={!globePaused}
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
export function GlobeSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#080c14]">
      <div className="text-center space-y-6">
        {/* Animated concentric rings */}
        <div className="relative w-24 h-24 mx-auto">
          <div
            className="absolute inset-0 rounded-full border border-[#4d9fff]/10 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute inset-2 rounded-full border border-[#4d9fff]/20 animate-ping"
            style={{ animationDuration: "2.4s", animationDelay: "0.4s" }}
          />
          <div
            className="absolute inset-4 rounded-full border-2 border-[#4d9fff]/30 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute inset-7 rounded-full border border-[#4d9fff]/50 animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#4d9fff]/60 animate-pulse" />
          </div>
        </div>

        {/* Skeleton text bars */}
        <div className="space-y-2 w-48 mx-auto">
          <div className="h-2 rounded-full bg-white/8 animate-pulse" />
          <div
            className="h-2 rounded-full bg-white/5 animate-pulse w-3/4 mx-auto"
            style={{ animationDelay: "0.2s" }}
          />
        </div>

        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.35em] animate-pulse">
          Loading Globe...
        </p>
      </div>
    </div>
  );
}

// ─── Canvas export ───────────────────────────────────────────────────────────
export function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.7], fov: 42 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      style={{ background: "#080c14" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
