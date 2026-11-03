import type { TPalette, TScheme } from "./interface";
const PALETTE_LIGHT: TPalette = {
  background: "#FFFFFF",
  bone: "#E6E6EB",
  boneSoft: "#EFEFF3",
  placeholder: "#C7C7CC",
  surface: "#F4F4F6",
};

const PALETTE_DARK: TPalette = {
  background: "#000000",
  bone: "#2C2C2E",
  boneSoft: "#1F1F22",
  placeholder: "#3A3A3C",
  surface: "#151517",
};

const PALETTES: Record<TScheme, TPalette> = {
  dark: PALETTE_DARK,
  light: PALETTE_LIGHT,
};

export { PALETTE_DARK, PALETTE_LIGHT, PALETTES };
