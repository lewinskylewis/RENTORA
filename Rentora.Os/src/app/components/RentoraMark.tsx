import { rentoraMark } from "@/app/rentora-mark";

/**
 * The official Rentora "R" mark (extracted from the brand app icon as a white
 * glyph on transparent) sized to sit inside the themed gradient logo tile.
 * `object-contain` preserves the glyph's aspect ratio inside a square box.
 */
export function RentoraMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={rentoraMark}
      alt="Rentora"
      draggable={false}
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
}
