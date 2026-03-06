"use client";
import { useRef, useMemo, Suspense } from "react";
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
