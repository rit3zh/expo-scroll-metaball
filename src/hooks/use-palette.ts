import type { TPalette } from "@/constants/interface";
import { PALETTES } from "@/constants/palette.const";
import { useColorScheme } from "react-native";

const usePalette = (): TPalette =>
  useColorScheme() === "dark" ? PALETTES.dark : PALETTES.light;

export { usePalette };
