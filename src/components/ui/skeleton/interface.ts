import type { DimensionValue, StyleProp, ViewStyle } from "react-native";

type TSkeletonTone = "soft" | "strong";
interface ISkeleton {
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  tone?: TSkeletonTone;
  width: DimensionValue;
}

export { type ISkeleton, type TSkeletonTone };
