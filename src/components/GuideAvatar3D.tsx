"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { usePageVisible } from "../hooks/usePageVisible";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type GuideReaction =
  | "neutral"
  | "confident"
  | "confident-pointing"
  | "worried"
  | "warning"
  | "surprised"
  | "moving-away"
  | "relieved";

export type GuideGesture =
  | "idle"
  | "wave"
  | "point-left"
  | "point-right"
  | "warning"
  | "celebrate";

export type GuideAvatar3DProps = {
  reaction?: GuideReaction;
  gesture?: GuideGesture;
  className?: string;
  label?: string;
  compact?: boolean;
};

type PointerTarget = { current: { x: number; y: number } };
type ArmPose = { shoulder: number; elbow: number };

const CHARCOAL = "#171c24";
const DEEP_CHARCOAL = "#080c12";
const OCEAN_BLUE = "#16ace5";
const PALE_BLUE = "#bcecff";

const ARM_POSES: Record<
  GuideGesture,
  { left: ArmPose; right: ArmPose }
> = {
  idle: {
    left: { shoulder: -0.12, elbow: -0.12 },
    right: { shoulder: 0.12, elbow: 0.12 },
  },
  wave: {
    left: { shoulder: -0.1, elbow: -0.08 },
    right: { shoulder: 2.42, elbow: -0.85 },
  },
  "point-left": {
    left: { shoulder: -1.54, elbow: 0.02 },
    right: { shoulder: 0.18, elbow: 0.18 },
  },
  "point-right": {
    left: { shoulder: -0.18, elbow: -0.18 },
    right: { shoulder: 1.54, elbow: -0.02 },
  },
  warning: {
    left: { shoulder: -1.06, elbow: -0.52 },
    right: { shoulder: 1.06, elbow: 0.52 },
  },
  celebrate: {
    left: { shoulder: -2.38, elbow: 0.42 },
    right: { shoulder: 2.38, elbow: -0.42 },
  },
};

function resolveGesture(
  reaction: GuideReaction,
  requested?: GuideGesture,
): GuideGesture {
  if (requested) return requested;

  switch (reaction) {
    case "confident":
    case "confident-pointing":
      return "point-right";
    case "worried":
    case "warning":
    case "surprised":
      return "warning";
    case "moving-away":
      return "point-left";
    case "relieved":
      return "celebrate";
    default:
      return "wave";
  }
}

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

function createPuzzleShape() {
  const shape = new THREE.Shape();

  shape.moveTo(-1.05, -1.15);
  shape.lineTo(-0.4, -1.15);
  shape.bezierCurveTo(-0.44, -1.46, -0.25, -1.68, 0, -1.68);
  shape.bezierCurveTo(0.25, -1.68, 0.44, -1.46, 0.4, -1.15);
  shape.lineTo(1.05, -1.15);
  shape.lineTo(1.05, -0.34);
  shape.bezierCurveTo(1.35, -0.42, 1.57, -0.24, 1.57, 0);
  shape.bezierCurveTo(1.57, 0.24, 1.35, 0.42, 1.05, 0.34);
  shape.lineTo(1.05, 1.15);
  shape.lineTo(0.39, 1.15);
  shape.bezierCurveTo(0.44, 1.47, 0.25, 1.69, 0, 1.69);
  shape.bezierCurveTo(-0.25, 1.69, -0.44, 1.47, -0.39, 1.15);
  shape.lineTo(-1.05, 1.15);
  shape.lineTo(-1.05, 0.34);
  shape.bezierCurveTo(-0.76, 0.43, -0.62, 0.25, -0.62, 0);
  shape.bezierCurveTo(-0.62, -0.25, -0.76, -0.43, -1.05, -0.34);
  shape.closePath();

  return shape;
}

function GuideFallback({ compact }: { compact: boolean }) {
  const size = compact ? 150 : 190;

  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        minHeight: compact ? 250 : 340,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: CHARCOAL,
          border: `3px solid ${OCEAN_BLUE}`,
          borderRadius: "26%",
          boxShadow: "0 24px 60px rgba(0,0,0,.42)",
          color: "white",
          display: "flex",
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          fontSize: compact ? 36 : 46,
          height: size,
          justifyContent: "center",
          position: "relative",
          width: size,
        }}
      >
        <span style={{ transform: "translateY(-4px)" }}>◕‿◕</span>
        <span
          style={{
            background: CHARCOAL,
            border: `3px solid ${OCEAN_BLUE}`,
            borderRadius: "50%",
            height: size * 0.32,
            left: "34%",
            position: "absolute",
            top: `-${size * 0.21}px`,
            width: size * 0.32,
          }}
        />
      </div>
    </div>
  );
}

function Brow({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: number;
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2 + rotation]}>
      <capsuleGeometry args={[0.045, 0.34, 6, 12]} />
      <meshStandardMaterial color={DEEP_CHARCOAL} roughness={0.56} />
    </mesh>
  );
}

function Mouth({ reaction }: { reaction: GuideReaction }) {
  if (reaction === "surprised" || reaction === "warning") {
    return (
      <group position={[0, -0.37, 0.39]}>
        <mesh scale={[0.25, reaction === "surprised" ? 0.34 : 0.27, 0.1]}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshStandardMaterial color="#020408" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.13, 0.09]} scale={[0.12, 0.045, 0.025]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color={OCEAN_BLUE} emissive={OCEAN_BLUE} emissiveIntensity={0.16} />
        </mesh>
      </group>
    );
  }

  if (reaction === "worried" || reaction === "moving-away") {
    return (
      <mesh position={[0, -0.45, 0.42]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.27, 0.055, 10, 32, Math.PI]} />
        <meshStandardMaterial color={DEEP_CHARCOAL} roughness={0.44} />
      </mesh>
    );
  }

  if (
    reaction === "relieved" ||
    reaction === "confident" ||
    reaction === "confident-pointing"
  ) {
    return (
      <group position={[0, -0.35, 0.39]}>
        <mesh scale={[0.4, 0.2, 0.1]}>
          <sphereGeometry args={[1, 26, 18]} />
          <meshStandardMaterial color="#020408" roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.065, 0.09]} scale={[0.3, 0.065, 0.035]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#f8fdff" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.095, 0.095]} scale={[0.17, 0.055, 0.03]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color="#5fd1f5" roughness={0.38} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={[0, -0.36, 0.42]} scale={[0.27, 0.075, 0.04]}>
      <sphereGeometry args={[1, 20, 12]} />
      <meshStandardMaterial color={DEEP_CHARCOAL} roughness={0.42} />
    </mesh>
  );
}

function ExpressiveFace({
  gesture,
  pageVisible,
  pointer,
  reaction,
  reducedMotion,
}: {
  gesture: GuideGesture;
  pageVisible: boolean;
  pointer: PointerTarget;
  reaction: GuideReaction;
  reducedMotion: boolean;
}) {
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const leftPupil = useRef<THREE.Group>(null);
  const rightPupil = useRef<THREE.Group>(null);

  const isWorried = reaction === "worried" || reaction === "moving-away";
  const isAlert = reaction === "warning" || reaction === "surprised";
  const browLift = reaction === "surprised" ? 0.13 : isAlert ? 0.05 : 0;
  const leftBrowRotation = isWorried ? -0.28 : isAlert ? 0.2 : -0.08;
  const rightBrowRotation = isWorried ? 0.28 : isAlert ? -0.2 : 0.08;

  useFrame(({ clock }, delta) => {
    if (!pageVisible || reducedMotion) return;

    const elapsed = clock.getElapsedTime();
    const blinkPhase = elapsed % 4.6;
    const blink = blinkPhase > 4.42 ? Math.max(0.08, Math.abs(blinkPhase - 4.51) * 10) : 1;
    const alertScale = reaction === "surprised" ? 1.12 : 1;

    for (const eye of [leftEye.current, rightEye.current]) {
      if (!eye) continue;
      eye.scale.y = THREE.MathUtils.damp(eye.scale.y, blink * alertScale, 24, delta);
      eye.scale.x = THREE.MathUtils.damp(eye.scale.x, alertScale, 10, delta);
    }

    let gazeX = pointer.current.x * 0.075;
    if (gesture === "point-left") gazeX -= 0.06;
    if (gesture === "point-right") gazeX += 0.06;
    const gazeY = pointer.current.y * 0.045;

    for (const pupil of [leftPupil.current, rightPupil.current]) {
      if (!pupil) continue;
      pupil.position.x = THREE.MathUtils.damp(pupil.position.x, gazeX, 7, delta);
      pupil.position.y = THREE.MathUtils.damp(pupil.position.y, gazeY, 7, delta);
    }
  });

  return (
    <group position={[0, 0.08, 0]}>
      {([-0.41, 0.41] as const).map((x, index) => (
        <group
          key={x}
          ref={index === 0 ? leftEye : rightEye}
          position={[x, 0.42, 0.4]}
        >
          <mesh scale={[0.31, 0.37, 0.14]}>
            <sphereGeometry args={[1, 28, 20]} />
            <meshPhysicalMaterial
              clearcoat={0.35}
              color="#f8fdff"
              roughness={0.28}
            />
          </mesh>
          <group
            ref={index === 0 ? leftPupil : rightPupil}
            position={[0, 0, 0.14]}
          >
            <mesh scale={[0.13, 0.16, 0.06]}>
              <sphereGeometry args={[1, 20, 16]} />
              <meshStandardMaterial color={OCEAN_BLUE} roughness={0.24} />
            </mesh>
            <mesh position={[0, 0, 0.052]} scale={[0.062, 0.085, 0.025]}>
              <sphereGeometry args={[1, 18, 14]} />
              <meshStandardMaterial color="#020408" roughness={0.22} />
            </mesh>
            <mesh position={[-0.035, 0.052, 0.078]} scale={0.018}>
              <sphereGeometry args={[1, 12, 10]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}

      <Brow
        position={[-0.42, 0.86 + browLift + (isWorried ? 0.045 : 0), 0.44]}
        rotation={leftBrowRotation}
      />
      <Brow
        position={[0.42, 0.86 + browLift + (isWorried ? 0.045 : 0), 0.44]}
        rotation={rightBrowRotation}
      />

      <mesh position={[-0.61, -0.15, 0.39]} scale={[0.16, 0.07, 0.025]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshBasicMaterial color={OCEAN_BLUE} opacity={0.2} transparent />
      </mesh>
      <mesh position={[0.61, -0.15, 0.39]} scale={[0.16, 0.07, 0.025]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshBasicMaterial color={OCEAN_BLUE} opacity={0.2} transparent />
      </mesh>

      <Mouth reaction={reaction} />
    </group>
  );
}

function Hand({ pointing = false }: { pointing?: boolean }) {
  return (
    <group>
      <mesh scale={[0.17, 0.2, 0.12]}>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial color={OCEAN_BLUE} metalness={0.04} roughness={0.42} />
      </mesh>
      {pointing ? (
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.055, 0.32, 6, 12]} />
          <meshStandardMaterial color={OCEAN_BLUE} roughness={0.42} />
        </mesh>
      ) : (
        [-0.1, 0, 0.1].map((x) => (
          <mesh key={x} position={[x, -0.18, 0]} scale={[0.7, 1, 0.7]}>
            <capsuleGeometry args={[0.035, 0.16, 5, 10]} />
            <meshStandardMaterial color={OCEAN_BLUE} roughness={0.42} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Arm({
  gesture,
  pageVisible,
  reducedMotion,
  side,
}: {
  gesture: GuideGesture;
  pageVisible: boolean;
  reducedMotion: boolean;
  side: -1 | 1;
}) {
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const pose = side === -1 ? ARM_POSES[gesture].left : ARM_POSES[gesture].right;
  const isPointing =
    (gesture === "point-left" && side === -1) ||
    (gesture === "point-right" && side === 1);

  useEffect(() => {
    if (!reducedMotion) return;
    if (shoulder.current) shoulder.current.rotation.z = pose.shoulder;
    if (elbow.current) elbow.current.rotation.z = pose.elbow;
  }, [pose.elbow, pose.shoulder, reducedMotion]);

  useFrame(({ clock }, delta) => {
    if (!pageVisible || reducedMotion) return;
    if (!shoulder.current || !elbow.current) return;

    const waveOffset = gesture === "wave" && side === 1
      ? Math.sin(clock.getElapsedTime() * 5.5) * 0.13
      : 0;
    shoulder.current.rotation.z = THREE.MathUtils.damp(
      shoulder.current.rotation.z,
      pose.shoulder,
      8,
      delta,
    );
    elbow.current.rotation.z = THREE.MathUtils.damp(
      elbow.current.rotation.z,
      pose.elbow + waveOffset,
      10,
      delta,
    );
  });

  return (
    <group
      ref={shoulder}
      position={[side * 1.12, 0.46, 0]}
      rotation={[0, 0, pose.shoulder]}
    >
      <mesh position={[0, -0.38, 0]}>
        <capsuleGeometry args={[0.12, 0.52, 8, 16]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.08} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <sphereGeometry args={[0.145, 16, 12]} />
        <meshStandardMaterial color="#222b36" roughness={0.48} />
      </mesh>
      <group ref={elbow} position={[0, -0.72, 0]} rotation={[0, 0, pose.elbow]}>
        <mesh position={[0, -0.34, 0]}>
          <capsuleGeometry args={[0.105, 0.44, 8, 16]} />
          <meshStandardMaterial color="#222b36" metalness={0.06} roughness={0.48} />
        </mesh>
        <group position={[0, -0.7, 0.02]}>
          <Hand pointing={isPointing} />
        </group>
      </group>
    </group>
  );
}

function Legs({
  pageVisible,
  reaction,
  reducedMotion,
}: {
  pageVisible: boolean;
  reaction: GuideReaction;
  reducedMotion: boolean;
}) {
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!pageVisible || reducedMotion) return;
    const moving = reaction === "moving-away";
    const stride = moving ? Math.sin(clock.getElapsedTime() * 4.2) * 0.28 : 0;
    if (leftLeg.current) {
      leftLeg.current.rotation.z = THREE.MathUtils.damp(leftLeg.current.rotation.z, stride, 8, delta);
    }
    if (rightLeg.current) {
      rightLeg.current.rotation.z = THREE.MathUtils.damp(rightLeg.current.rotation.z, -stride, 8, delta);
    }
  });

  return (
    <group>
      {([-1, 1] as const).map((side) => (
        <group
          key={side}
          ref={side === -1 ? leftLeg : rightLeg}
          position={[side * 0.45, -1.27, -0.02]}
        >
          <mesh position={[0, -0.36, 0]}>
            <capsuleGeometry args={[0.14, 0.48, 8, 16]} />
            <meshStandardMaterial color="#111821" roughness={0.52} />
          </mesh>
          <mesh position={[0, -0.78, 0.11]} rotation={[0.2, 0, 0]} scale={[1.3, 0.78, 1.65]}>
            <sphereGeometry args={[0.18, 18, 12]} />
            <meshStandardMaterial color={DEEP_CHARCOAL} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.78, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.14, 0.025, 8, 24, Math.PI]} />
            <meshBasicMaterial color={OCEAN_BLUE} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Character({
  compact,
  gesture,
  pageVisible,
  pointer,
  reaction,
  reducedMotion,
}: {
  compact: boolean;
  gesture: GuideGesture;
  pageVisible: boolean;
  pointer: PointerTarget;
  reaction: GuideReaction;
  reducedMotion: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const puzzleShape = useMemo(() => createPuzzleShape(), []);

  useEffect(() => {
    if (!reducedMotion || !root.current) return;
    root.current.position.set(0, compact ? -0.02 : 0.06, 0);
    root.current.rotation.set(0, 0, 0);
  }, [compact, reducedMotion]);

  useFrame(({ clock }, delta) => {
    if (!root.current || !pageVisible || reducedMotion) return;

    const elapsed = clock.getElapsedTime();
    const reactionLean = reaction === "moving-away" ? -0.08 : reaction === "confident-pointing" ? 0.05 : 0;
    root.current.position.y = THREE.MathUtils.damp(
      root.current.position.y,
      (compact ? -0.02 : 0.06) + Math.sin(elapsed * 1.2) * 0.045,
      5,
      delta,
    );
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      -pointer.current.y * 0.035,
      5,
      delta,
    );
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      pointer.current.x * 0.08 + reactionLean,
      5,
      delta,
    );
    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      Math.sin(elapsed * 0.8) * 0.012,
      4,
      delta,
    );
  });

  return (
    <group ref={root} position={[0, compact ? -0.02 : 0.06, 0]} scale={compact ? 0.88 : 1}>
      <Legs pageVisible={pageVisible} reaction={reaction} reducedMotion={reducedMotion} />
      <Arm gesture={gesture} pageVisible={pageVisible} reducedMotion={reducedMotion} side={-1} />
      <Arm gesture={gesture} pageVisible={pageVisible} reducedMotion={reducedMotion} side={1} />

      <mesh castShadow>
        <extrudeGeometry
          args={[
            puzzleShape,
            {
              bevelEnabled: true,
              bevelOffset: -0.02,
              bevelSegments: 5,
              bevelSize: 0.09,
              bevelThickness: 0.08,
              curveSegments: 20,
              depth: 0.42,
              steps: 1,
            },
          ]}
        />
        <meshPhysicalMaterial
          clearcoat={0.58}
          clearcoatRoughness={0.32}
          color={CHARCOAL}
          metalness={0.14}
          roughness={0.38}
        />
      </mesh>

      <mesh position={[0, 0.06, -0.035]} scale={[1.015, 1.015, 1]}>
        <extrudeGeometry
          args={[
            puzzleShape,
            {
              bevelEnabled: false,
              curveSegments: 18,
              depth: 0.045,
              steps: 1,
            },
          ]}
        />
        <meshBasicMaterial color={OCEAN_BLUE} opacity={0.11} transparent />
      </mesh>

      <ExpressiveFace
        gesture={gesture}
        pageVisible={pageVisible}
        pointer={pointer}
        reaction={reaction}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

function Scene({
  compact,
  gesture,
  pageVisible,
  pointer,
  reaction,
  reducedMotion,
}: {
  compact: boolean;
  gesture: GuideGesture;
  pageVisible: boolean;
  pointer: PointerTarget;
  reaction: GuideReaction;
  reducedMotion: boolean;
}) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <hemisphereLight args={[PALE_BLUE, "#071018", 1.6]} />
      <directionalLight color="#f4fbff" intensity={2.2} position={[3.5, 4.5, 5]} />
      <pointLight color={OCEAN_BLUE} intensity={12} position={[-3, 1.5, 2.5]} />
      <pointLight color="#477dff" intensity={7} position={[3, -1, -1]} />

      <Character
        compact={compact}
        gesture={gesture}
        pageVisible={pageVisible}
        pointer={pointer}
        reaction={reaction}
        reducedMotion={reducedMotion}
      />

      <mesh position={[0, -2.12, -0.32]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.35, 0.45, 1]}>
        <circleGeometry args={[1.45, 48]} />
        <meshBasicMaterial color="#02070b" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, -2.1, -0.3]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.25, 0.42, 1]}>
        <ringGeometry args={[1.25, 1.29, 64]} />
        <meshBasicMaterial color={OCEAN_BLUE} opacity={0.38} transparent />
      </mesh>
    </>
  );
}

export function GuideAvatar3D({
  reaction = "neutral",
  gesture: requestedGesture,
  className = "",
  label = "Expressive 3D beach-safety guide",
  compact = false,
}: GuideAvatar3DProps) {
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const webGLSupported = useWebGLSupport();
  const pointer = useRef({ x: 0, y: 0 });
  const gesture = resolveGesture(reaction, requestedGesture);

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
      aria-label={label}
      className={className}
      data-gesture={gesture}
      data-reaction={reaction}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      role="img"
      style={{
        background:
          "radial-gradient(circle at 50% 43%, rgba(22,172,229,.24), rgba(8,14,22,.08) 50%, transparent 74%)",
        height: "100%",
        isolation: "isolate",
        minHeight: compact ? 250 : 340,
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {webGLSupported ? (
        <Canvas
          aria-hidden="true"
          camera={{
            far: 30,
            fov: compact ? 38 : 35,
            near: 0.1,
            position: [0, 0.05, compact ? 6.5 : 6.1],
          }}
          dpr={[1, compact ? 1.25 : 1.5]}
          fallback={<GuideFallback compact={compact} />}
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
          <Scene
            compact={compact}
            gesture={gesture}
            pageVisible={pageVisible}
            pointer={pointer}
            reaction={reaction}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      ) : (
        <GuideFallback compact={compact} />
      )}
    </div>
  );
}

export default GuideAvatar3D;
