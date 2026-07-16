import type { LucideIcon, LucideProps } from "lucide-react";
import {
  AlertTriangle,
  CircleDashed,
  CloudLightning,
  Construction,
  Mountain,
  Shovel,
  Siren,
  Umbrella,
  Waves,
} from "lucide-react";

export const hazardIcons: Record<string, LucideIcon> = {
  Shovel,
  Waves,
  Mountain,
  Siren,
  CloudLightning,
  Umbrella,
  Construction,
  Parachute: CircleDashed,
};

export function getHazardIcon(name: string) {
  return hazardIcons[name] ?? AlertTriangle;
}

export function HazardGlyph({ name, ...props }: LucideProps & { name: string }) {
  switch (name) {
    case "Shovel": return <Shovel {...props} />;
    case "Waves": return <Waves {...props} />;
    case "Mountain": return <Mountain {...props} />;
    case "Siren": return <Siren {...props} />;
    case "CloudLightning": return <CloudLightning {...props} />;
    case "Umbrella": return <Umbrella {...props} />;
    case "Construction": return <Construction {...props} />;
    case "Parachute": return <CircleDashed {...props} />;
    default: return <AlertTriangle {...props} />;
  }
}
