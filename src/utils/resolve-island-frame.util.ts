import {
  ISLAND_DRAWN_HEIGHT,
  ISLAND_DRAWN_WIDTH,
  ISLAND_FALLBACK_MIN_CENTER,
  ISLAND_FALLBACK_SIZE,
  ISLAND_HARDWARE_HALF_HEIGHT,
  ISLAND_HARDWARE_MIN_INSET,
  ISLAND_HARDWARE_TOP_OFFSET,
} from "@/constants/layout.const";
import type { TIslandFrame } from "@/hooks/interface";
import { Platform } from "react-native";

const resolveIslandFrame = (
  insetTop: number,
  screenWidth: number,
): TIslandFrame => {
  const isHardware: boolean =
    Platform.OS === "ios" && insetTop >= ISLAND_HARDWARE_MIN_INSET;

  if (isHardware) {
    return {
      centerX: screenWidth / 2,
      centerY:
        insetTop - ISLAND_HARDWARE_TOP_OFFSET + ISLAND_HARDWARE_HALF_HEIGHT,
      halfHeight: ISLAND_DRAWN_HEIGHT / 2,
      halfWidth: ISLAND_DRAWN_WIDTH / 2,
      isHardware,
    };
  }

  return {
    centerX: screenWidth / 2,
    centerY: Math.max(insetTop / 2, ISLAND_FALLBACK_MIN_CENTER),
    halfHeight: ISLAND_FALLBACK_SIZE / 2,
    halfWidth: ISLAND_FALLBACK_SIZE / 2,
    isHardware,
  };
};

export { resolveIslandFrame };
