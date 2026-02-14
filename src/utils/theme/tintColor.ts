/** Blend two hex colors together. 0 = all base, 1 = all tint. */
export function tintColor(base: string, tint: string, amount = 0.3): string {
  const parse = (hex: string) => parseInt(hex.replace("#", ""), 16);
  const b = parse(base);
  const t = parse(tint);

  const blend = (shift: number) =>
    Math.round(((b >> shift) & 0xff) + (((t >> shift) & 0xff) - ((b >> shift) & 0xff)) * amount);

  return `#${[16, 8, 0].map((s) => blend(s).toString(16).padStart(2, "0")).join("")}`;
}
