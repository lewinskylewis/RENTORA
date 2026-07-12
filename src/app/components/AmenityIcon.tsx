import { Car, Dumbbell, Shield, Wifi } from "lucide-react";

export function AmenityIcon({ amenity }: { amenity: string }) {
  const icons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-4 h-4" />,
    gym: <Dumbbell className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    security: <Shield className="w-4 h-4" />,
  };
  return icons[amenity] ?? null;
}
