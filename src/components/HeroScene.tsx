"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import * as THREE from "three";
import { usePageVisible } from "../hooks/usePageVisible";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type HeroSceneProps = {
  /** Used to add a very small attitude change without deforming the mascot. */
  reaction?: string;
  /** Trims geometry and pixel density for smaller/mobile placements. */
  compact?: boolean;
  className?: string;
};

type PointerTarget = MutableRefObject<{ x: number; y: number }>;

const MASCOT_VISIBLE_HEIGHT = 0.91;
const MASCOT_URL = `${import.meta.env.BASE_URL}mascot.webp`;

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", {
          failIfMajorPerformanceCaveat: true,
        });

        setSupported(Boolean(context));
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setSupported(false);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return supported;
}

function MascotFallback({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "11%",
          right: "7%",
          bottom: compact ? "8%" : "5%",
          height: compact ? "19%" : "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(240,202,114,.3) 0%, rgba(7,59,92,.75) 42%, transparent 72%)",
          transform: "perspective(500px) rotateX(64deg)",
          filter: "blur(2px)",
        }}
      />
      {/* Native image is intentional here: it is the no-WebGL fallback, not
          responsive content that should enter the framework image pipeline. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MASCOT_URL}
        alt=""
        draggable={false}
        style={{
          position: "relative",
          width: compact ? "min(96%, 430px)" : "min(94%, 620px)",
          height: "auto",
          clipPath: "inset(9% 0 0 0)",
          transform: "translateY(3%)",
          filter: "drop-shadow(0 26px 34px rgba(0,0,0,.48))",
          userSelect: "none",
        }}
      />
    </div>
  );
}

function getReactionTilt(reaction: string) {
  const normalized = reaction.toLowerCase();

  if (/surpris|worried|warning|urgent|alarm|shock|duck|run/.test(normalized)) {
    return 0.035;
  }

  if (/confident|point|relieved|thumb/.test(normalized)) {
    return -0.025;
  }

  return 0;
}

function MascotPlane({
  compact,
  pageVisible,
  pointer,
  reaction,
  reducedMotion,
}: {
  compact: boolean;
  pageVisible: boolean;
  pointer: PointerTarget;
  reaction: string;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const sourceTexture = useLoader(THREE.TextureLoader, MASCOT_URL);
  const texture = useMemo(() => {
    const croppedTexture = sourceTexture.clone();

    // The source screenshot includes a narrow headline across its top edge.
    // Sampling only the lower 91% removes it; plane sizing below compensates
    // for the crop so the mascot itself is never stretched or squashed.
    croppedTexture.colorSpace = THREE.SRGBColorSpace;
    croppedTexture.wrapS = THREE.ClampToEdgeWrapping;
    croppedTexture.wrapT = THREE.ClampToEdgeWrapping;
    croppedTexture.repeat.set(1, MASCOT_VISIBLE_HEIGHT);
    croppedTexture.offset.set(0, 0);
    croppedTexture.minFilter = THREE.LinearMipmapLinearFilter;
    croppedTexture.magFilter = THREE.LinearFilter;
    croppedTexture.needsUpdate = true;

    return croppedTexture;
  }, [sourceTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  const sourceImage = sourceTexture.image as
    | { naturalHeight?: number; naturalWidth?: number; height?: number; width?: number }
    | undefined;
  const sourceWidth = sourceImage?.naturalWidth ?? sourceImage?.width ?? 1;
  const sourceHeight = sourceImage?.naturalHeight ?? sourceImage?.height ?? 1;
  const planeHeight = compact ? 3.15 : 3.72;
  const planeWidth =
    planeHeight * (sourceWidth / (sourceHeight * MASCOT_VISIBLE_HEIGHT));
  const baseY = compact ? 0.05 : 0.1;
  const reactionTilt = getReactionTilt(reaction);

  useEffect(() => {
    if (!group.current || !reducedMotion) return;

    group.current.position.set(0.08, baseY, 0.1);
    group.current.rotation.set(0, reactionTilt, 0);
  }, [baseY, reactionTilt, reducedMotion]);

  useFrame(({ clock }, delta) => {
    if (!group.current || !pageVisible || reducedMotion) return;

    const elapsed = clock.getElapsedTime();
    const targetX = THREE.MathUtils.clamp(-pointer.current.y * 0.045, -0.05, 0.05);
    const targetY = THREE.MathUtils.clamp(
      pointer.current.x * 0.085 + reactionTilt,
      -0.12,
      0.12,
    );

    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      3.5,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      3.5,
      delta,
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      Math.sin(elapsed * 0.58) * 0.008,
      3,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      baseY + Math.sin(elapsed * 0.75) * 0.045,
      4,
      delta,
    );
  });

  return (
    <group ref={group} position={[0.08, baseY, 0.1]}>
      <mesh position={[0.08, -0.06, -0.08]} scale={1.025}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          color="#020305"
          depthWrite={false}
          opacity={0.5}
          transparent
        />
      </mesh>
      <mesh>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          alphaTest={0.01}
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function OceanSurface({
  pageVisible,
  reducedMotion,
}: {
  pageVisible: boolean;
  reducedMotion: boolean;
}) {
  const surface = useRef<THREE.Group>(null);
  const rippleA = useRef<THREE.Mesh>(null);
  const rippleB = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!pageVisible || reducedMotion) return;

    const elapsed = clock.getElapsedTime();
    if (surface.current) {
      surface.current.rotation.y = Math.sin(elapsed * 0.18) * 0.025;
    }
    if (rippleA.current) {
      rippleA.current.rotation.z += delta * 0.035;
      const pulse = 1 + Math.sin(elapsed * 0.65) * 0.025;
      rippleA.current.scale.set(1.35 * pulse, 0.72 * pulse, 1);
    }
    if (rippleB.current) {
      rippleB.current.rotation.z -= delta * 0.025;
      const pulse = 1 + Math.cos(elapsed * 0.52) * 0.02;
      rippleB.current.scale.set(1.12 * pulse, 0.62 * pulse, 1);
    }
  });

  return (
    <group ref={surface} position={[0, -1.55, -1.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.2, 0.76, 1]}>
        <circleGeometry args={[3.15, 64]} />
        <meshPhysicalMaterial
          clearcoat={0.55}
          clearcoatRoughness={0.34}
          color="#073b5c"
          metalness={0.06}
          opacity={0.8}
          roughness={0.28}
          transparent
        />
      </mesh>
      <mesh
        ref={rippleA}
        position={[0, 0.025, 0]}
        rotation={[-Math.PI / 2, 0, 0.16]}
        scale={[1.35, 0.72, 1]}
      >
        <ringGeometry args={[1.72, 1.745, 96]} />
        <meshBasicMaterial
          color="#18aeea"
          depthWrite={false}
          opacity={0.3}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh
        ref={rippleB}
        position={[0, 0.04, -0.12]}
        rotation={[-Math.PI / 2, 0, -0.3]}
        scale={[1.12, 0.62, 1]}
      >
        <ringGeometry args={[2.32, 2.34, 96]} />
        <meshBasicMaterial
          color="#8fdcff"
          depthWrite={false}
          opacity={0.16}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}

function BeachPlatform() {
  return (
    <group position={[0, -1.34, -0.05]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.77, 1.96, 0.34, 64]} />
        <meshStandardMaterial color="#082b3c" metalness={0.24} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.66, 1.78, 0.12, 64]} />
        <meshStandardMaterial color="#caa765" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.268, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 48]} />
        <meshBasicMaterial
          color="#020306"
          depthWrite={false}
          opacity={0.34}
          transparent
        />
      </mesh>
      <mesh position={[0, 0.275, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.64, 0.015, 8, 96]} />
        <meshBasicMaterial color="#f0ca72" toneMapped={false} />
      </mesh>
    </group>
  );
}

function GoldOrbit({
  pageVisible,
  reducedMotion,
}: {
  pageVisible: boolean;
  reducedMotion: boolean;
}) {
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!orbit.current || !pageVisible || reducedMotion) return;
    orbit.current.rotation.z += delta * 0.055;
  });

  return (
    <group ref={orbit} position={[0.05, 0.2, -0.55]} rotation={[0.12, -0.2, -0.18]}>
      <mesh scale={[1, 0.76, 1]}>
        <torusGeometry args={[2.42, 0.011, 8, 128]} />
        <meshBasicMaterial
          color="#f0ca72"
          depthWrite={false}
          opacity={0.72}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh position={[2.16, 0.66, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#fff0ae" toneMapped={false} />
      </mesh>
    </group>
  );
}

function FloatingObject({
  children,
  pageVisible,
  phase,
  position,
  reducedMotion,
  scale = 1,
}: {
  children: ReactNode;
  pageVisible: boolean;
  phase: number;
  position: [number, number, number];
  reducedMotion: boolean;
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!group.current || !reducedMotion) return;
    group.current.position.set(...position);
    group.current.rotation.set(0, 0, 0);
  }, [position, reducedMotion]);

  useFrame(({ clock }, delta) => {
    if (!group.current || !pageVisible || reducedMotion) return;

    const elapsed = clock.getElapsedTime();
    group.current.position.y =
      position[1] + Math.sin(elapsed * 0.72 + phase) * 0.09;
    group.current.rotation.y += delta * (0.13 + phase * 0.008);
    group.current.rotation.z = Math.sin(elapsed * 0.46 + phase) * 0.055;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {children}
    </group>
  );
}

function WarningFlag() {
  return (
    <group rotation={[0.08, 0.18, -0.08]}>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.018, 0.025, 0.82, 8]} />
        <meshStandardMaterial color="#f0ca72" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.22, 0]}>
        <boxGeometry args={[0.43, 0.25, 0.035]} />
        <meshStandardMaterial color="#d04b38" roughness={0.52} />
      </mesh>
    </group>
  );
}

function Lifebuoy() {
  return (
    <group>
      <mesh>
        <torusGeometry args={[0.22, 0.074, 12, 36]} />
        <meshStandardMaterial color="#e55d3f" roughness={0.44} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0.035]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[0.1, 0.15, 0.065]} />
          <meshStandardMaterial color="#f4f1e8" roughness={0.62} />
        </mesh>
      ))}
    </group>
  );
}

function Whistle() {
  return (
    <group rotation={[0, 0.2, -0.22]}>
      <mesh scale={[0.5, 0.27, 0.2]}>
        <sphereGeometry args={[0.46, 20, 14]} />
        <meshStandardMaterial color="#f0ca72" metalness={0.42} roughness={0.32} />
      </mesh>
      <mesh position={[0.24, 0.01, 0]}>
        <boxGeometry args={[0.27, 0.14, 0.16]} />
        <meshStandardMaterial color="#f0ca72" metalness={0.42} roughness={0.32} />
      </mesh>
      <mesh position={[-0.24, 0.02, 0.02]}>
        <torusGeometry args={[0.11, 0.025, 8, 20]} />
        <meshStandardMaterial color="#c89a3c" metalness={0.46} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Shell() {
  return (
    <group rotation={[0.45, -0.25, 0.22]}>
      <mesh scale={[0.55, 0.38, 0.2]}>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial color="#f4d9a7" roughness={0.72} />
      </mesh>
      {[-0.16, -0.08, 0, 0.08, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.015, 0.09]} scale={[0.02, 0.26, 0.02]}>
          <sphereGeometry args={[0.45, 8, 8]} />
          <meshBasicMaterial color="#b88742" opacity={0.7} transparent />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({
  pageVisible,
  reducedMotion,
}: {
  pageVisible: boolean;
  reducedMotion: boolean;
}) {
  const particles = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(36 * 3);

    for (let index = 0; index < 36; index += 1) {
      const angle = index * 2.399963;
      const radius = 1.8 + ((index * 7) % 17) * 0.15;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = -1.4 + ((index * 11) % 29) * 0.13;
      positions[index * 3 + 2] = -1.4 + ((index * 5) % 13) * 0.18;
    }

    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return points;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!particles.current || !pageVisible || reducedMotion) return;
    particles.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={particles} geometry={geometry}>
      <pointsMaterial
        color="#bde9fb"
        depthWrite={false}
        opacity={0.38}
        size={0.026}
        sizeAttenuation
        transparent
      />
    </points>
  );
}

function SceneContent({
  compact,
  pageVisible,
  pointer,
  reaction,
  reducedMotion,
}: {
  compact: boolean;
  pageVisible: boolean;
  pointer: PointerTarget;
  reaction: string;
  reducedMotion: boolean;
}) {
  const objectScale = compact ? 0.82 : 1;

  return (
    <>
      <fog attach="fog" args={["#07090d", 5.2, 10.5]} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#73d3f6", "#2e1f12", 1.35]} />
      <directionalLight color="#f0ca72" intensity={1.8} position={[3, 4, 4]} />
      <pointLight color="#18aeea" intensity={10} position={[-3, 0.2, 1.5]} />

      <group scale={compact ? 0.9 : 1} position={[0, compact ? -0.05 : 0, 0]}>
        <ParticleField pageVisible={pageVisible} reducedMotion={reducedMotion} />
        <OceanSurface pageVisible={pageVisible} reducedMotion={reducedMotion} />
        <BeachPlatform />
        <GoldOrbit pageVisible={pageVisible} reducedMotion={reducedMotion} />

        <FloatingObject
          pageVisible={pageVisible}
          phase={0.4}
          position={[-2.25, 1.45, -0.2]}
          reducedMotion={reducedMotion}
          scale={objectScale}
        >
          <WarningFlag />
        </FloatingObject>
        <FloatingObject
          pageVisible={pageVisible}
          phase={1.8}
          position={[2.2, 1.38, 0.15]}
          reducedMotion={reducedMotion}
          scale={objectScale}
        >
          <Lifebuoy />
        </FloatingObject>
        <FloatingObject
          pageVisible={pageVisible}
          phase={3.2}
          position={[-2.45, -0.15, 0.35]}
          reducedMotion={reducedMotion}
          scale={objectScale}
        >
          <Whistle />
        </FloatingObject>
        {!compact && (
          <FloatingObject
            pageVisible={pageVisible}
            phase={4.7}
            position={[2.5, -0.28, -0.1]}
            reducedMotion={reducedMotion}
            scale={objectScale}
          >
            <Shell />
          </FloatingObject>
        )}

        <Suspense fallback={null}>
          <MascotPlane
            compact={compact}
            pageVisible={pageVisible}
            pointer={pointer}
            reaction={reaction}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </group>
    </>
  );
}

export default function HeroScene({
  className = "",
  compact = false,
  reaction = "neutral",
}: HeroSceneProps) {
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const webGLSupported = useWebGLSupport();
  const pointer = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1,
      );
      pointer.current.y = THREE.MathUtils.clamp(
        -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
        -1,
        1,
      );
    },
    [reducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    pointer.current.x = 0;
    pointer.current.y = 0;
  }, []);

  return (
    <div
      aria-label="Black and gold beach-safety mascot above a circular shoreline platform"
      className={`hero-scene ${className}`.trim()}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      role="img"
      style={{
        background:
          "radial-gradient(circle at 48% 45%, rgba(7,59,92,.68), rgba(7,9,13,.18) 48%, transparent 72%)",
        height: "100%",
        isolation: "isolate",
        minHeight: compact ? 360 : 520,
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {webGLSupported ? (
        <Canvas
          aria-hidden="true"
          camera={{ fov: compact ? 38 : 35, near: 0.1, far: 30, position: [0, 0.35, 7] }}
          dpr={[1, compact ? 1.25 : 1.5]}
          fallback={<MascotFallback compact={compact} />}
          frameloop={pageVisible && !reducedMotion ? "always" : "demand"}
          gl={{
            alpha: true,
            antialias: !compact,
            depth: true,
            powerPreference: "high-performance",
            stencil: false,
          }}
          performance={{ debounce: 240, max: 1, min: 0.55 }}
          shadows={false}
          style={{ height: "100%", width: "100%" }}
        >
          <SceneContent
            compact={compact}
            pageVisible={pageVisible}
            pointer={pointer}
            reaction={reaction}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      ) : (
        <MascotFallback compact={compact} />
      )}
    </div>
  );
}
