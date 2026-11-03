import { usePalette } from "@/hooks/use-palette";
import { registerComponent } from "@/utils/register-component.util";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import type { ISkeleton } from "./interface";

const SkeletonBase: FC<ISkeleton> = ({
  height,
  radius,
  style,
  tone = "strong",
  width,
}: ISkeleton & React.ComponentProps<typeof SkeletonBase>): React.ReactNode &
  React.JSX.Element => {
  const palette = usePalette();

  return (
    <View
      style={[
        styles.bone,
        {
          backgroundColor: tone === "soft" ? palette.boneSoft : palette.bone,
          borderRadius: radius ?? height / 2,
          height,
          width,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  bone: {
    borderCurve: "continuous",
  },
});

const Skeleton = registerComponent("Skeleton", SkeletonBase);

export { Skeleton };
